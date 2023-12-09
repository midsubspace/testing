shell=get_shell
computer=shell.host_computer
current_path=computer.File("/home/quinn")
files=[]
folders=[]
check_perms=function(file)
    if file.has_permission("w") then return "WRX"
    if file.has_permission("r") and file.has_permission("x") then 
        return "-RX"
    else
        return "-R-"
    end if
    if file.has_permission("x") then return "--X"
end function


display_list=function(current_path)
    print("Current Path:"+current_path.path)
    data="Name"+" "+"Owner"+ " "+"Permissions"
    for file in current_path.get_files
        files.push(file)
    end for
    for folder in current_path.get_folders
        folders.push(folder)
    end for
    for file in files
        name=file.name
        owner=file.owner
        perms=check_perms(file)
        data = data + char(10) + name+" "+owner+" "+perms
    end for
    for folder in folders
        name=folder.name
        owner=folder.owner
        perms=check_perms(folder)
        data = data + char(10) + name+" "+owner+" "+perms
    end for
    print char(10)+format_columns(data)
end function

menu=function(options,current_path)
    clear_screen
    n=0
    display_list(current_path)
    for option in options
        print n+")"+option
    end for
end function
options=["cd"]
while true
    menu(options,current_path)
    action=user_input("ACTION>").val
    if options[action]=="cd" then
        full=1
        new_place=user_input("Name of folder to enter>")
        for folder in folders
            if folder.name==new_place then
                current_path=computer.File(folder.path)
                full=0
                break
            end if
        end for
        if full==1 and new_place!=".." then current_path=computer.File(new_place)
        if full==1 and new_place==".." then
            list=current_path.path.split("/")
            if list.len==2 then 
                current_path=computer.File("/")
            else
                list.pop
                current_path=computer.File(list.join("/"))
            end if
        end if
        files=[]
        folders=[]
    end if
end while