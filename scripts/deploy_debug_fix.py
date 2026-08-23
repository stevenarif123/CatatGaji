import paramiko
import time

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('145.223.108.248', port=65002, username='u496707900', password='Mantapfb1_')
sftp = client.open_sftp()
remote_root = '/home/u496707900/domains/stevenarif.my.id/public_html/catatgaji'

sftp.put('apps/api/dist/routes/debug.js', f'{remote_root}/apps/api/dist/routes/debug.js')
print('Uploaded updated apps/api/dist/routes/debug.js')
sftp.close()

client.exec_command("pkill -f 'apps/api/dist/main.js' || true")
time.sleep(1)
client.exec_command(f"cd {remote_root} && nohup /opt/alt/alt-nodejs20/root/usr/bin/node apps/api/dist/main.js </dev/null >api.log 2>&1 &")
time.sleep(3)

stdin, stdout, stderr = client.exec_command('curl -s http://127.0.0.1:3000/health')
print('Health check:', stdout.read().decode('utf-8', errors='ignore').strip())

client.close()
print('Done deploying fixed debug.js!')
