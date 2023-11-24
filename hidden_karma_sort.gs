os={}
shell=get_shell
computer=shell.host_computer
exts=["log","jpg"]
os.files=[]
os.folders=[]
current_folder=current_path

check = function(folder)
    folders = folder.get_folders
    files = folder.get_files

    for file in files
        os.files.push(file)
    end for

    for folder in folders
        os.folders.push(folder)
    end for
end function


search=function()
    files=[]
    for file in os.files
        files.push(file)
    end for

    for file in files
        name=file.name
        if name.split("\.").len==2 then 
            if exts.indexOf(name.split("\.")[1])!=null then 
                if exts[exts.indexOf(name.split("\.")[1])]=="jpg" then 
                    print char(10)+"ImageViewer.exe "+file.path
                else if exts[exts.indexOf(name.split("\.")[1])]=="log" and name.split("\.")[0]!="system" then
                    print char(10)+"LogViewer.exe "+file.path
                end if
            end if
        end if
    end for
end function

show_folders = function(f)
    for folder in f.get_folders
        res = show_folders(folder)
        check(folder)
        
        if res then
            return res
        end if
    end for
    return ("")
end function
show_folders(get_shell.host_computer.File("/"))
search()