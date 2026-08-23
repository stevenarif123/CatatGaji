import paramiko

HOST = "145.223.108.248"
PORT = 65002
USER = "u496707900"
PASS = "Mantapfb1_"
REMOTE_ROOT = "/home/u496707900/domains/stevenarif.my.id/public_html/catatgaji"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=15)

# Setup persistent crontab watchdog
cron_job = f"""* * * * * pgrep -f 'apps/api/dist/main.js' > /dev/null || (cd {REMOTE_ROOT} && nohup /opt/alt/alt-nodejs20/root/usr/bin/node apps/api/dist/main.js </dev/null >api.log 2>&1 &)
@reboot cd {REMOTE_ROOT} && nohup /opt/alt/alt-nodejs20/root/usr/bin/node apps/api/dist/main.js </dev/null >api.log 2>&1 &
"""

cmd = f"(crontab -l 2>/dev/null | grep -v 'apps/api/dist/main.js'; echo \"{cron_job}\") | crontab -"
client.exec_command(cmd)

stdin, stdout, stderr = client.exec_command("crontab -l")
print("[OK] Active Crontab:")
print(stdout.read().decode('utf-8', errors='ignore').strip())

client.close()
