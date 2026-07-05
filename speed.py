#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import subprocess
import json
import platform
import time
import sys

def ping_host(host, count=3):
    """تنفيذ ping لخادم معين وإرجاع متوسط زمن الاستجابة بالمللي ثانية"""
    try:
        # تحديد أمر ping حسب نظام التشغيل
        param = '-n' if platform.system().lower() == 'windows' else '-c'
        timeout = '-w' if platform.system().lower() == 'windows' else '-W'
        timeout_val = '2' if platform.system().lower() == 'windows' else '2'
        
        cmd = ['ping', param, str(count), timeout, timeout_val, host]
        output = subprocess.check_output(cmd, stderr=subprocess.STDOUT, universal_newlines=True)
        
        # استخراج متوسط الوقت
        if platform.system().lower() == 'windows':
            # Windows: "Average = 12ms"
            lines = output.split('\n')
            for line in lines:
                if 'Average' in line or 'متوسط' in line:
                    import re
                    nums = re.findall(r'(\d+)ms', line)
                    if nums:
                        return float(nums[0])
        else:
            # Linux/Mac: "rtt min/avg/max/mdev = 12.345/15.678/20.123/2.345 ms"
            for line in output.split('\n'):
                if 'rtt' in line and '=' in line:
                    parts = line.split('=')
                    if len(parts) > 1:
                        stats = parts[1].strip().split('/')
                        if len(stats) >= 2:
                            return float(stats[1])
        return None
    except Exception:
        return None

def main():
    # قائمة الخوادم لقياس البنج
    hosts = [
        ('🌐 Google DNS', '8.8.8.8'),
        ('☁️ Cloudflare', '1.1.1.1'),
        ('🔓 OpenDNS', '208.67.222.222'),
        ('📡 WhatsApp', 'wa.me'),
    ]
    
    results = []
    total_ping = 0
    valid_count = 0
    
    for name, host in hosts:
        ping_ms = ping_host(host, count=2)
        if ping_ms is not None:
            results.append({
                'name': name,
                'host': host,
                'ping': round(ping_ms, 2)
            })
            total_ping += ping_ms
            valid_count += 1
        else:
            results.append({
                'name': name,
                'host': host,
                'ping': None
            })
    
    # حساب المتوسط
    avg_ping = round(total_ping / valid_count, 2) if valid_count > 0 else None
    
    output = {
        'results': results,
        'average': avg_ping,
        'valid_count': valid_count,
        'total_count': len(hosts)
    }
    
    print(json.dumps(output))

if __name__ == '__main__':
    main()