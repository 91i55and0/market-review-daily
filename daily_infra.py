#!/usr/bin/env python3
"""每日复盘报告 - 基础设施脚本"""
import os, sys, shutil, json, re
from datetime import datetime, timezone, timedelta

REPO = "/workspace/market-review-daily"
REPORTS = os.path.join(REPO, "reports")
INDEX = os.path.join(REPO, "index.html")
TOKEN = os.environ.get("GH_TOKEN", "")

def get_today():
    bj = datetime.now(timezone(timedelta(hours=8)))
    return bj.strftime("%Y-%m-%d")

def get_report_dirs():
    if not os.path.exists(REPORTS): return []
    return sorted([d for d in os.listdir(REPORTS) if os.path.isdir(os.path.join(REPORTS,d)) and len(d)==10 and d[4]=='-' and d[7]=='-'], reverse=True)

def find_report_html(date_dir):
    d = os.path.join(REPORTS, date_dir)
    if not os.path.isdir(d): return None
    for f in os.listdir(d):
        if f.endswith(".html"): return os.path.join(date_dir, f)
    return None

def action_setup():
    today = get_today()
    os.makedirs(os.path.join(REPORTS, today), exist_ok=True)
    print(f"TODAY={today}")
    print(f"DIR={os.path.join(REPORTS, today)}")

def action_cleanup():
    today = get_today()
    today_dt = datetime.strptime(today, "%Y-%m-%d")
    for d in get_report_dirs():
        try:
            if (today_dt - datetime.strptime(d, "%Y-%m-%d")).days > 7:
                shutil.rmtree(os.path.join(REPORTS, d))
        except: pass

def action_update_index():
    entries = []
    for d in get_report_dirs():
        html = find_report_html(d)
        if html:
            with open(os.path.join(REPORTS, html), encoding='utf-8', errors='ignore') as f:
                content = f.read()[:500]
            label = "A股+美股深度复盘(优化版)" if "优化版" in content else ("A股+美股合并" if "美股" in content else "A股复盘")
            entries.append({"date": d, "file": html, "label": label})
    with open(INDEX, encoding='utf-8') as f:
        html = f.read()
    new_html = re.sub(r'var reports\s*=\s*\[.*?\];', f"var reports = {json.dumps(entries, ensure_ascii=False)};", html, flags=re.DOTALL)
    with open(INDEX, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f"首页已更新 {len(entries)} 条")

def action_git_push():
    today = get_today()
    cmds = f"cd {REPO} && git remote set-url origin https://91i55and0:{TOKEN}@github.com/91i55and0/market-review-daily.git && git config user.email bot@trae.cn && git config user.name MarketBot && git add -A && git commit -m '每日深度复盘报告 {today}' 2>/dev/null; git push origin main 2>&1 | tail -3 && git push origin main:master 2>&1 | tail -3"
    os.system(cmds)

def action_check_exists():
    """检查今天报告是否已存在，AI据此判断是否要生成"""
    today = get_today()
    html = find_report_html(today)
    if html:
        fp = os.path.join(REPORTS, html)
        size = os.path.getsize(fp)
        print(f"EXISTS=true")
        print(f"PATH={html}")
        print(f"SIZE={size}")
    else:
        print(f"EXISTS=false")

def action_all():
    action_setup(); action_cleanup(); action_update_index(); action_git_push()

if __name__ == "__main__":
    if len(sys.argv) < 2: print("用法: python3 daily_infra.py [setup|cleanup|update_index|git_push|check_exists|all]"); sys.exit(1)
    globals()[f"action_{sys.argv[1]}"]()