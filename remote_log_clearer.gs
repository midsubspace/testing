ip=null;password=null
if params.len>0 then
    ip=params[0]
    password=params[1]
end if
if ip==null then ip=user_input("IP Address:")
if password==null then password=user_input("Password:")
remote_shell=get_shell.connect_service(ip,22,"root",password)
print(typeof(remote_shell))
print(ip)
print(password)
user_input("BREAK",0,1)
user_input("MUST HAVE EMPTYED LOG FILE ALREADY and copyed it to /root/system.log")
get_shell.scp("/root/system.log","/var",remote_shell)

//1) clear the system.log by running sudo -s on your home computer and then LogViewer.exe
//2) do cp /var/system.log /root/system.log
//3) Change the ip address and password on the first line to the remote server you want to clear the log of
//4) make sure you are disconnected fully from the remote server
//5) Run the program

//Notes_ works needs to be added to weaponG 10/24/2023 9:23 pm