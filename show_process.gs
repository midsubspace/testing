task_manager=function()
    computer=get_shell.host_computer
    list = computer.show_procs.split(char(10))
    process_list = []
    for item in list
        parsedItem = item.split(" ")
        process = {}
        process.user = parsedItem[0]
        process.pid = parsedItem[1]
        process.cpu = parsedItem[2]
        process.mem = parsedItem[3]
        process.command = parsedItem[4]
        process_list.push(process)
    end for
    data="USER PID CPU MEM COMMAND"
    for process in process_list
        if process.command=="COMMAND" then continue
        user=process.user
        pid=process.pid
        cpu=process.cpu
        mem=process.mem
        command=process.command
        data=data+char(10)+user+" "+pid+" "+cpu+" "+mem+" "+command
    end for
    print format_columns(data)
end function
task_manager