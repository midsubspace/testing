//gotten from https://github.com/fera282828/Greyhack/blob/main/lock-system.src
if params and params[0] == "-h" then exit("Usage: lock-system [opt: -s]")
isSecure = false
if params.len > 0 and params[0] == "-s" then isSecure = true
rootPass = user_input("Root password: ", 1)
rootShell = get_shell("root", rootPass)
if typeof(rootShell) != "shell" then exit("Incorrect password")
host = rootShell.host_computer
systemRoot = host.File("/")
systemRoot.chmod("g-wrx", 1)
systemRoot.chmod("u-wrx", 1)
systemRoot.chmod("o-wrx", 1)
if isSecure then
    terminal = host.File("/usr/bin/Terminal.exe")
    sudo = host.File("/bin/sudo")
    if terminal then
        terminal.chmod("g+x", 0)
    else
        print("[-] Terminal.exe not found")
    end if

    if sudo then
        sudo.chmod("g+x", 0)
    else
        print("[-] sudo not found")
    end if
end if