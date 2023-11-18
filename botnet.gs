//{"IP":"","USER":"","PORT":22,"PASSWORD":""},
servers=[{"IP":"32.235.89.144","USER":"root","PORT":22,"PASSWORD":"chelsea"},
{"IP":"163.214.145.187","USER":"test","PORT":22,"PASSWORD":"test"},
{"IP":"164.246.658.125","USER":"Johnny","PORT":22,"PASSWORD":"AppleSeed"}]
n=0
for server in servers
    print("---------------------------")
    print "LIST NUMBER:"+n
    print "IP:"+servers[n].IP
    print "User:"+servers[n].USER
    print "Port:"+servers[n].PORT
    print "Password:"+servers[n].PASSWORD
    n=n+1
end for
n=user_input("Pick a server to use:").to_int
server=servers[n]


options=["connect"]
n=0
print(char(10)+"BOTNET MENU:")
for option in options
    print(n+")"+option)
end for
n=user_input("Pick an option above").to_int


connect=function(server)
    shell=get_shell.connect_service(server.IP,server.PORT,server.USER,server.PASSWORD)
    if typeof(shell)=="shell" then 
        computer=shell.host_computer
        print "CONNECTED TO:"+computer.public_ip
        shell.start_terminal
    else
        print "FALIED TO CONNECT"
        print server
    end if
end function

if options[n]=="connect" then connect(server)
