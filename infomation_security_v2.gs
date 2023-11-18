shell=get_shell
computer=shell.host_computer
root_folder=computer.File("/")
passwd_file=null
user_access=[]
if not root_folder then exit "Path to '/' Not Found"
if not computer.File("/etc/passwd") then
    print("Password File Not Found")
else
    if computer.File("/etc/passwd").has_permission("r") then passwd_file=computer.File("/etc/passwd").get_content
end if
users=computer.File("/home")
if not users then
    print "/Home folder not found!"
else
    if users.has_permission("r") then
        for user in users.get_folders
            if user.has_permission("r") then 
                user_access.push(user)
            end if
        end for
    end if
end if
print "Can Access:"
for user in user_access
    print user.name
end for