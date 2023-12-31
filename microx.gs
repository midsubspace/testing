// Not Mine Found At https://github.com/Microft506/microx/blob/master/microx.src
//I Am Just Updating It To Work In The Current GreyHack Versions
microx_version = "3.0"

getParam = function(paramType)
	rnp=0
	for param in params
		if rnp then return param
		if param == (paramType) then rnp=1
	end for
	return false
end function

loadLibrary = function(libFileName, search)
	paths=[""]
	if search then paths = [current_path, "/lib", "/bin", "/usr/bin"]
	for p in paths
		lib = include_lib(p + "/" + libFileName)
		if lib then return lib
	end for
	error("Could not find requested library: " + libFileName)
	return false
end function

loadMetaXPloit = function()
	return loadLibrary("metaxploit.so", true)
end function

isAParam = function(paramType)
	for param in params
		if param.lower == paramType.lower then return true
	end for
	return false
end function

error = function(str)
	print("<color=#FF2222><b>  ERROR: </b></color>" + str)
end function

info = function(str)
	if isAParam("-v") then print("<I>  Info: " + str + "</I>")
end function

getRouter = function(IPAddress)	
	// Load the router object.
	router = get_router(IPAddress)
	if not router then 
		error("Could not find a router at the given address: " + IPAddress)
		return null
	end if

	return router
end function

padSpaces = function(s, l, p=" ")
	if typeof(s) == "number" then s = s + ""
	if s.len >= l then return s
	padString = ""
	c = l - s.len
	while c > 0
		padString = padString + p
		c = c - 1
	end while
	return (s+padString)
end function

padSpacesRight = function(s, l, p=" ")
	if typeof(s) == "number" then s = s + ""
	if s.len >= l then return s
	padString = ""
	c = l - s.len
	while c > 0
		padString = p + padString
		c = c - 1
	end while
	return (padString+s)
end function

extractMetaLibs = function(router)
	returnValue = []
	
	if typeof(router) == "router" then 
		externalPorts = router.used_ports
	else if typeof(router) == "string" then
		externalPorts = get_router().device_ports(router)
	end if
	
	metaxploit = loadMetaXPloit()
	
	if typeof(router) == "router" then 
		routerLib = metaxploit.net_use(router.public_ip).dump_lib
	else
		routerLib = metaxploit.net_use(get_router().public_ip).dump_lib
	end if
	
	if routerLib then 
		if typeof(router) == "router" then
			returnValue.push({"public_ip": router.public_ip, "local_ip": router.local_ip, "port_number":-1, "metaLib":routerLib})
		else
			returnValue.push({"public_ip": get_router().public_ip, "local_ip": router, "port_number":-1, "metaLib":routerLib})
		end if
	else
		error("Could not map exploit library to router at: " + router.public_ip)
	end if
	
	for port in externalPorts
		metalib = null
		if typeof(router) == "router" then
			metalib = metaxploit.net_use(router.public_ip, port.port_number)
		else
			metalib = metaxploit.net_use(router, port.port_number)
		end if
		if not metalib then continue
		metalib = metalib.dump_lib
		if not metalib then	
			error("Could not map exploit to public port at: " + router.public_ip + ":" + port.port_number)
		else
			if typeof(router) == "router" then
				returnValue.push({"public_ip": router.public_ip,"local_ip": port.get_lan_ip, "port_number":port.port_number, "metaLib":metalib})
			else
				returnValue.push({"public_ip": get_router().public_ip,"local_ip": port.get_lan_ip, "port_number":port.port_number, "metaLib":metalib})
			end if
		end if
	end for
	
	return returnValue
	
end function

loadExploits = function(metaLib)
	// Loads all the exploits appropriate for 
	if typeof(metaLib) == "string" then 
		fileName = metaLib
	else 
		fileName = getLibFileName(metaLib)
	end if
	
	filePath = "/lib/"
	
	get_shell.host_computer.touch(filePath, fileName)
	exploitLibFile = get_shell.host_computer.File(filePath+fileName)
	
	if not exploitLibFile then 
		error("Could not find exploit library.")
		return false
	end if
	
	info("Loading library..")
	
	rValue = []
	newKey = false
	lines = exploitLibFile.get_content.split(char(10))
	info("Library contains " + lines.len + " lines of data.")
	
	for line in lines
		if line.len == 0 then continue
		colsUntrimmed = line.split("::")
		cols = []
		for col in colsUntrimmed
			cols.push(col.trim)
		end for
		if cols.len < 2 then continue
		if cols[0] == "exploit" then
			if newKey then rValue.push(newKey)
			newKey = {"type": cols[1]}
		else if cols[0] == "parameters" or cols[0] == "requirements" then 
			newKey[cols[0]] = cols[1:]
		else
			newKey[cols[0]] = cols[1]
		end if
	end for
	if newKey then rValue.push(newKey)
	
	return rValue
end function

displayLocalMap = function(localMachineIP)
	// Display the ports open on this machine
	router = get_router()
	localPorts = router.device_ports(localMachineIP)
	externalPorts = router.used_ports
	
	print("\n<b>Local Machine at " + localMachineIP)
	if localPorts.len == 0 then print("| | --> <i>No local ports detected.</b>")
	for localPort in localPorts
		s = "| |"
		if localPort.is_closed then
			s = s + "-X-> "
		else 
			s = s + "---> "
		end if
		s = padSpacesRight(s + ":" + localPort.port_number + " ", 6)
		s = s + router.port_info(localPort)
		for externalPort in externalPorts
			iPort = router.ping_port(externalPort.port_number)
			if iPort.port_number == localPort.port_number and iPort.get_lan_ip == localMachineIP then
				s = s + "--> External Address: " + router.public_ip + ":" + externalPort.port_number
			end if
		end for
		print(s)
	end for
	
	print("|\n|---> <b>"+router.essid_name+"</b> ("+router.bssid_name+")")
	print("      Public IP: <b>" + router.public_ip + "</b>  Private IP: <b>" + router.local_ip + "</b>")
	routerLib = loadMetaXPloit().net_use(router.public_ip).dump_lib
	whoisLines = whois(router.public_ip).split(char(10))
	for whoisLine in whoisLines
		if whoisLine.len > 1 then
			cols = whoisLine.split(":")
			print("      <b>" + padSpacesRight(cols[0], 25) + ":</b> " + cols[1:].join(""))
		end if
	end for
	print("      " + routerLib.lib_name + " is at version: " + routerLib.version)
	
end function

displayRouterMap = function(mRouter)
	// This routine simply displays the router.
	if mRouter.essid_name == "" then 
		essid_name = "<i>No ESSID</i>"
	else
		essid_name = mRouter.essid_name
	end if
	
	print("\n<b>"+essid_name+"</b> ("+mRouter.bssid_name+")")
	print("Public IP: <b>" + mRouter.public_ip + "</b>  Private IP: <b>" + mRouter.local_ip + "</b>")
	routerLib = loadMetaXPloit().net_use(mRouter.public_ip).dump_lib
	whoisLines = whois(mRouter.public_ip).split(char(10))
	for whoisLine in whoisLines
		if whoisLine.len > 1 then
			cols = whoisLine.split(":")
			print("<b>" + padSpacesRight(cols[0], 25) + ":</b> " + cols[1:].join(""))
		end if
	end for
	print(routerLib.lib_name + " is at version: " + routerLib.version)
	
	portFwds = []
	blankPorts = []
	for externalPort in mRouter.used_ports
		internal = mRouter.ping_port(externalPort.port_number)
		if internal then portFwds.push({"external":externalPort, "internal":internal})
		arrows = "--->"
		arrows2 = " ---> "
		if externalPort.is_closed then arrows = "-X->"
		if not mRouter.ping_port(externalPort.port_number) then 
			arrows2 = " ---> ? "
		else if mRouter.ping_port(externalPort.port_number).is_closed then 
			arrows2 = " -X-> "
		end if
		print(" |  |"+arrows+" :" + padSpaces(externalPort.port_number, 5) +" " + padSpaces(mRouter.port_info(externalPort).split(" ")[0], 8) + " " + padSpaces(mRouter.port_info(externalPort).split(" ")[1], 8) + arrows2 + externalPort.get_lan_ip)
	end for
		
	if not mRouter.devices_lan_ip then
		print(" |-> <i>No local machines detected.</i>")
	else
		for localMachine in mRouter.devices_lan_ip
			print(" |-> <b>Machine at " + localMachine + "</b>")
			vbar = "|"
			if mRouter.devices_lan_ip.indexOf(localMachine) == (mRouter.devices_lan_ip.len-1) then vbar = " "
			if not mRouter.device_ports(localMachine) then
				print(" "+vbar+"   |--> <i>No ports detected.</i>")
			else 
				for port in mRouter.device_ports(localMachine)
					arrows = "-->"
					if port.is_closed then arrows = "-X>"
					toPrint = " "+vbar+"   |"+arrows+" :" + padSpaces(port.port_number, 5) + " " + padSpaces(mRouter.port_info(port).split(" ")[0], 8) + " " + padSpaces(mRouter.port_info(port).split(" ")[1], 8)
					for portFwd in portFwds
						if port.get_lan_ip == portFwd.internal.get_lan_ip and port.port_number == portFwd.internal.port_number then toPrint = toPrint + " ---> external port " + portFwd.external.port_number
					end for
					print(toPrint)
				end for
			end if
		end for
	end if
end function

getLibFileName = function(metaLib)
	return metaLib.lib_name + "_v" + metaLib.version + ".txt"
end function

writeExploits = function(exploits, metaLib)
	fileName = getLibFileName(metaLib)
	filePath = "/lib/"
	
	get_shell.host_computer.touch(filePath, fileName)
	file = get_shell.host_computer.File(filePath+fileName)

	outputString = ""
	if not file then 
		error("Could not open " + filename + " for output.")
		return false
	end if
	for exploit in exploits
		if exploit.hasIndex("type") then outputString = outputString + "exploit::" + exploit.type + char(10)
		for key in exploit.indexes
			if key == "memory" then outputString = outputString + "     "
			if key == "string" or key == "requirements" then outputString = outputString + "     "
			if key == "parameters" then outputString = outputString + "     "
			outputString = outputString + key
			value = exploit[key]
			if typeof(value) == "string" then
				outputString = outputString + "::" + value
			else if typeof(value) == "list" then
				for val in value
					outputString = outputString + "::" + val
				end for
			else
				error("writeExploits: Don't know what to do with type: " + typeof(value) + " while writing key: " + key)
				return false
			end if
			outputString = outputString + char(10)
		end for
	end for
	file.set_content(outputString)
end function

scanTarget = function(target)
	// Scans the target and appends the data to the file as needed.
	
	metaxploit = loadMetaXPloit()
	addresses = metaxploit.scan(target)
	info("Found " + addresses.len + " memory addresses.")
	
	info("Updating library...")

	expList = []
	expMap = false
	requirements = false
	for address in addresses
		exploits = metaxploit.scan_address(target, address)
		lines = exploits.split(char(10))
		for line in lines
			info("Analyzing: " + line)
			if line.len == 0 then continue
			if line.indexOf("Unsafe check") == 0 then
				if expMap then 
					if requirements then 
						expMap.push("requirements")
						expMap["requirements"] = requirements
						info("Adding requirements to object")
					end if
					expList.push(expMap)
					info("pushing object: " + expMap)
				end if
				startPos = line.indexOf("<b>")+3
				endPos = line.indexOf("</b>")
				info("Creating new object with keystring: " + line[startPos:endPos])
				expMap = {"exploit":"Unknown", "string":line[startPos:endPos], "memory":address}
				requirements = false
			else if line[0] == "*" then
				if requirements then 
					requirements = requirements + "::" + line
					info("Updated requirements: " + requirements)
				else
					info("New requirements set: " + line)
					requirements = line
				end if
			end if
		end for
	end for
	if expMap then 
		if requirements then 
			expMap.push("requirements")
			expMap["requirements"] = requirements
			info("Adding requirements to object")
		end if
		expList.push(expMap)
		info("pushing object: " + expMap)
	end if
	

	fileName = getLibFileName(target)
	filePath = "/lib/"
	
	get_shell.host_computer.touch(filePath, fileName)
	exploitLibFile = get_shell.host_computer.File(filePath+fileName)
	
	newEntries = ""
	for exp in expList
		if target.lib_name == "kernel_router.so" then exp.exploit = "Router"
		newEntries = newEntries + "exploit::" + exp.exploit+char(10)
		newEntries = newEntries + "     memory::" + exp.memory+char(10)
		newEntries = newEntries + "     string::" + exp.string+char(10)
		if exp.hasIndex("requirements") then newEntries = newEntries + "     requirements::"+exp.requirements+char(10)
		if target.lib_name == "kernel_router.so" then 
			newEntries = newEntries + "     parameters::Local IP Address\n"
		end if 
	end for
		
	exploitLibFile.set_content(exploitLibFile.get_content + newEntries)
	info("library updated.")
	
	writeExploits(removeDuplicates(loadExploits(target)), target)
	
end function

removeDuplicates = function(exploits)
	index1 = -1
	startCount = exploits.len
	for exploit in exploits
		index1 = index1 + 1
		index2 = exploits.len -1
		while index2 > index1
			if exploit.memory == exploits[index2].memory and exploit.string == exploits[index2].string then exploits.remove(index2)
			index2 = index2 - 1
		end while
	end for
	finalCount = exploits.len
	info("Removed " + (startCount-finalCount) + " duplicate items from exploit library.")
	return exploits
end function

get_choice = function(choices, default = -1)
	c = 0
	for choice in choices
		if c == 0 then 
			print("<b>" + choices[0] + "</b>")
		else 
			selString = "<b>[" + c + "]</b>"
			print(padSpaces(selString, 12) + choices[c])
		end if
		c = c + 1
	end for
	if default > -1 then
		prompt = "[default="+default+"] > "
	else
		prompt = "> "
	end if
	while 1
		user_choice = user_input(prompt)
		if user_choice.len == 0 and default > -1 then return default
		user_choice = user_choice.to_int
		if not typeof(user_choice) == "number" or user_choice < 1 or user_choice >= c then 
			error("Not a valid choice")
			continue
		end if
		return user_choice
	end while
end function

get_yesno = function(default, prompt = "")
	if prompt.len > 0 then print("<b>"+prompt+"</b>")
	if default then
		prompt = "[Enter = Yes] > "
	else
		prompt = "[Enter = No] > "
	end if
	while 1
		resp = user_input(prompt)
		if resp.len == 0 then return default
		if resp.lower[0] == "y" then return true
		if resp.lower[0] == "n" then return false
	end while
end function

chooseMetaLib = function(metaLibs)
	while 1
		print("\n<b>Found the following entry point(s): </b>")
		c = 0
		for metaLib in metaLibs
			c = c + 1
			if metaLib.port_number == -1 then
				print("<b>[" + c + "] " + metaLib.metaLib.lib_name + "</b> (Version: " + metaLib.metaLib.version + ") --> " + metaLib.local_ip)
			else 
				print("<b>[" + c + "] " + metaLib.metaLib.lib_name + "</b> (Version: " + metaLib.metaLib.version + ") --> " + metaLib.local_ip + ":" + metaLib.port_number)
			end if
			print("     <i>" + loadExploits(metaLib.metaLib).len + " exploits on file.</i>")
		end for
		print("<b>[S]</b> Scan an entry point for exploits.")
		print("<b>[A]</b> Scan ALL entry points for new exploits.")
		print("<b>[X]</b> None.  Exit now.")
	
		print("Which one would you like to use?")
		i = user_input("> ")
		if i.len == 0 then continue
		if i.lower[0] == "x" then return null
		if i.lower[0] == "a" then
			print("Scanning <b>ALL</b> libraries for vulnerabilities")
			for metaLib in metaLibs
				print("Scanning " + metaLib.metaLib.lib_name + ", version " + metaLib.metaLib.version)
				scanTarget(metaLib.metaLib)
			end for
			continue
		end if
		if i.lower[0] == "s" then
			choices = ["Choose which library to scan"]
			for metaLib in metaLibs
				choices.push(metaLib.metaLib.lib_name + ", version " + metaLib.metaLib.version)
			end for
			userChoice = get_choice(choices)
			scanTarget(metaLibs[userChoice-1].metaLib)
			continue
		end if
		i = i.to_int
		if i < 1 or i > c then 
			error("Not a valid response.  Try again")
			continue
		end if
		return metaLibs[i-1]
	end while
end function

changeExploitType = function(exploitToChange, target, newType)
	info("Updating exploit type from " + exploitToChange.type + " to " + newType)
	newExploit = exploitToChange
	exploitList = loadExploits(target)
	c = -1
	for exploit in exploitList
		c = c + 1
		if exploit.memory == exploitToChange.memory and exploit.string == exploitToChange.string then 
			if newType.lower == "shell" or newType.lower == "computer" or newType.lower == "file" then
				exploitList[c].type = newType
				info("Changing entry " + c + " to " + newType)
				newExploit = exploitList[c]
			else if newType.lower == "rootpass" or newType.lower == "userpass" then
				if newType.lower == "rootpass" then
					exploitList[c].type = "Change root password"
				else
					exploitList[c].type = "Change user password"
				end if
				if not exploitList[c].hasIndex("parameters") then exploitList[c].push("parameters")
				exploitList[c].parameters = ["New Password"]
				newExploit = exploitList[c]
			end if
		end if
	end for
	
	writeExploits(exploitList, target)
	return newExploit
end function

runExploit = function(exploit, target)
	while 1
		info("\n<b>Applying exploit <i>" + exploit.type + "</i> against target: <i>" + target.lib_name + "</i></b>")
		
		ps = []
		if exploit.hasIndex("parameters") then
			print("<b>Additional information needed.  Please answer the following questions</b>")
			for parameter in exploit.parameters
				ps.push(user_input(parameter + " >"))
			end for
		end if
		
		if ps.len == 0 then 
			overflowResult = target.overflow(exploit.memory, exploit.string)
		else if ps.len == 1 then
			overflowResult = target.overflow(exploit.memory, exploit.string, ps[0])
		else if ps.len == 2 then
			overflowResult = target.overflow(exploit.memory, exploit.string, ps[0], ps[1])
		else if ps.len == 3 then
			overflowResult = target.overflow(exploit.memory, exploit.string, ps[0], ps[1], ps[2])
		else
			error("Too many parameters")
			return null
		end if
		
		info("Result is an object of type <i>" + typeof(overflowResult) + "</i>")
		
		if typeof(overflowResult) == "null" then
			choices = ["\nA null object may indicate either a failure or a need to include more information.\nPlease indicate which of the following is the case:"]
			choices.push("The attack failed because one or more requirements were not met.")
			choices.push("The attack is listed as the wrong type or needs to be defined.")
			choice = get_choice(choices, 1)
			if choice == 1 then 
				return null
			else if choice == 2 then 
				choices_b = ["\n<b>Which type of attack should this be listed as?"]
				choices_b.push("A root user password change")
				choices_b.push("A regular user password change")
				choices_b.push("Nevermind, leave it as it is.")
				choice_b = get_choice(choices_b, choices_b.len-1)
				if choice_b == 1 then
					changeExploitType(exploit, target, "rootpass")
					return
				else if choice_b == 2 then
					changeExploitType(exploit, target, "userpass")
					return
				else
					continue
				end if
			end if 
		else if typeof(overflowResult) == "shell" or typeof(overflowResult) == "computer" or typeof(overflowResult) == "file" then
			if not exploit.type.lower == typeof(overflowResult) then 
				changeExploitType(exploit, target, typeof(overflowResult).upper[0] + typeof(overflowResult)[1:])
			end if
			return overflowResult
		else
			return overflowResult
		end if
	end while
end function	

getAccessString = function(fileObj)
	perm = ""
			
	if fileObj.has_permission("r") then 
		perm = "r"
	else 
		perm = "-"
	end if
	
	if fileObj.has_permission("w") then 
		perm = perm + "w"
	else
		perm = perm + "-"
	end if
	
	if fileObj.has_permission("x") then 
		perm = perm + "x"
	else
		perm = perm + "-"
	end if
	
	return perm
end function

getColorString = function(fileObj)
	if fileObj.has_permission("r") and fileObj.has_permission("w") then return("88FFFF")
	if fileObj.has_permission("r") then return("8888FF")
	if fileObj.has_permission("w") then return("88FF88")
	return("FF8888")
end function

messWithProcs = function(computer)
	while 1
		choices = ["\n\n<b>The following processes have been detected on the machine:</b>\nChoose the one you would like to kill."]
		procs = computer.show_procs.split(char(10))
		PIDs = []
		for b in range(0, procs.len-1)
			procCols = procs[b].split(" ")
			for c in range(0, procCols.len-2)
				procCols[c] = padSpaces(procCols[c], 10)
			end for
			if b == 0 then 
				choices[0] = choices[0] + "\n     " + procCols.join("")
			else
				choices.push(procCols.join(""))
				PIDs.push(procCols[1])
			end if
		end for
		choices.push("<i>Leave these procs do their proc'ing (exit)</i>")
		choice = get_choice(choices, choices.len-1)
		if choice == choices.len-1 then return
		print("<b>Attempting to kill process ID: " + PIDs[choice-1])
		r = computer.close_program(PIDs[choice-1].to_int)
		if r == 1 then
			print("<b>SUCCESS!</b>  You really showed that process you can murder it.")
		else if r == 0 then
			error("Could not find the process.")
		else
			error(r)
		end if
	end while 
end function

messWithUsers = function(computer)
	choices = ["\n<b>What would you like to do?</b>"]
	choices.push("Add a user.")
	choices.push("Delete a user.")
	choices.push("Forget it.")
	choice = get_choice(choices, choices.len-1)
	result = null
	if choice == 1 then
		un = user_input("New user name? > ")
		pw = user_input("Password? > ")
		result = computer.create_user(un,pw)
	else if choice == 2 then
		un = user_input("User to delete? >")
		delHome = get_yesno(false,"Delete home directory?")
		result = computer.delete_user(un, delHome)
	else
		return
	end if
	if result == 1 then
		print("<b>SUCCESS!</b>")
	else
		error(result)
	end if
end function

crackPasswordFile = function(filePtr, hostInfo="")
	crypto = loadLibrary("crypto.so", true)
	lines = filePtr.get_content.split(char(10))
	for line in lines
		results = []
		line = split(line.trim, ":")
		if line.len == 2 and line[1].len == 32 then
			print("Cracking MD5 hash for user: <b><i>" + line[0] + "</b></i> in file: <b><i>" + filePtr.path + "</b></i>")
			pw = crypto.decipher(line[1])
			if pw then
				print("Password: ["+pw+"]")
				get_shell().host_computer.touch(home_dir, "crackedPasswords.txt")
				f = get_shell().host_computer.File(home_dir+"/crackedPasswords.txt")
				f.set_content(f.get_content + char(10) + padSpaces(line[0]+"@"+pw, 30) + " " + hostInfo + ": " + filePtr.name)
			end if
		end if
	end for
end function

crackAllFiles = function(filePtr, hostInfo="")
	subDirs = filePtr.get_folders
	files = filePtr.get_files
	for file in files
		if file.has_permission("r") and not file.is_binary then crackPasswordFile(file, hostInfo)
	end for
	for dir in subDirs
		crackAllFiles(dir, hostInfo)
	end for
end function

crackAllFilesFromTop = function(filePtr, hostInfo="")
	while filePtr.parent
		filePtr = filePtr.parent
	end while
	crackAllFiles(dir, hostInfo)
end function

unlockAllFiles = function(filePtr)
	subDirs = filePtr.get_folders
	files = filePtr.get_files
	for file in files
		file.chmod("o+rwx")
	end for
	for directory in subDirs
		directory.chmod("o+rwx")
		unlockAllFiles(directory)
	end for
end function

findUnlockedRWString = function(readPerm, writePerm)
	if readPerm and writePerm then
		return "read and write"
	else if readPerm then
		return "read"
	else if writePerm then
		return "write"
	else
		return "no"
	end if
end function

findUnlocked = function(dirPtr)
	directories = dirPtr.get_folders
	files = dirPtr.get_files
	if dirPtr.has_permission("w") then print("Directory at <b>" + dirPtr.path +"</b> has write permission.")
	if files.len > 0 then
		for file in files
			if not findUnlockedRWString(file.has_permission("r"), file.has_permission("w"))=="no" then
				print("File at <b>" + file.path + "</b> has " + findUnlockedRWString(file.has_permission("r"), file.has_permission("w")) + " permissions.")
			end if
		end for
	end if
	if directories.len > 0 then
		for directory in directories
			findUnlocked(directory)
		end for
	end if
end function

browseFiles = function(dirPtr, hostInfo = "")
	while not dirPtr.parent == null 
		dirPtr = dirPtr.parent
	end while
	rootPtr = dirPtr
	while 1
		directories = dirPtr.get_folders
		files = dirPtr.get_files
		choices = ["\n\n<b>Contents of " + dirPtr.path + ":</b>\n     <color=#" + getColorString(dirPtr) + ">" + dirPtr.permissions + padSpaces("", 19) + "<.>" ]
		isRoot = (dirPtr.path == "/")

		if not isRoot then choices.push("<color=#"+getColorString(dirPtr.parent)+">" + dirPtr.parent.permissions + "                   <..></color>")
			
		for directory in directories			
			choices.push("<color=#"+getColorString(directory)+">" + directory.permissions + " " + padSpacesRight(directory.owner, 8, " ") + " " + padSpaces(directory.group, 8, " ") + " ./" + padSpaces(directory.name, 19, ".") +"<dir></color>")
		end for

		if files.len > 25 then 
			files = files[0:24]
			print("Possible file bomb detected.  Only showing the first 25 files.")
		end if
		
		for file in files
			binString = "<binary>"
			if not file.is_binary then binString = "<text>"
			choices.push("<color=#"+getColorString(file)+">" + file.permissions + " " + padSpacesRight(file.owner, 8, " ") + " " + padSpaces(file.group, 8, " ") + " " + padSpaces(file.name, 20, ".") + "." + padSpaces(binString, 9) + file.size + " bytes</color>")
		end for
		
		choices.push("--- Stop browsing files ---")
		
		choice = get_choice(choices, choices.len-1)
		
		if choice == choices.len-1 then break
		
		if (not isRoot and choice == 1) then
			// The user has chosen to back up a directory
			dirPtr = dirPtr.parent
		else if (directories.len > 0 and isRoot and choice <= directories.len) or (directories.len > 0 and not isRoot and choice <= (1+directories.len)) then
			// The user has chosen a directory
			if isRoot then 
				dirPtr = directories[choice-1]
			else
				dirPtr = directories[choice-2]
			end if
		else if (file.len > 0 and isRoot and choice > directories.len) or (file.len > 0 and not isRoot and choice > (directories.len+1)) then
			filePtr = null
			if isRoot then
				filePtr = files[choice - directories.len - 1]
			else
				filePtr = files[choice - directories.len - 2]
			end if
			choicesb = ["\n\n<b>What would you like to do with this file?"]
			choicesb.push("Display contents")
			choicesb.push("Download file")
			choicesb.push("Over-write file")
			choicesb.push("Delete")
			choicesb.push("Append")
			choicesb.push("Scan for and crack passwords")
			//choicesb.push("Unlock all files from here down")
			choicesb.push("Do nothing")
			choiceb = get_choice(choicesb, choicesb.len-1)
			if choiceb == choicesb.len-1 then break
			if choiceb == 1 or choiceb == 2 then
				if filePtr.get_content then
					if choiceb == 1 then
						print("\n\n<b>Contents of file: " + filePtr.name + "</b>")
						print(filePtr.get_content)
					else
						get_shell.host_computer.touch(home_dir + "/Downloads", filePtr.name)
						print("Saving file to: " + home_dir + "/Downloads/" + filePtr.name)
						x = get_shell.host_computer.File(home_dir + "/Downloads/" + filePtr.name).set_content(filePtr.get_content)
						if(x == 1) then
							print("File downloaded successfully.")
						else
							error(x)
						end if
					end if
				else
					error("Could not read the contents of this file - Check permissions and file type.")
				end if
			else if choiceb == 3 then
				x = user_input("<b>Please enter what you would like to replace the contents of this file with.</b>\n")
				x = filePtr.set_content(x)
				if(x == 1) then
					print("File overwritten successfully.")
				else
					error(x)
				end if
			else if choiceb == 4 then
				if get_yesno(false, "Are you sure you want to delete this file?") then 
					x = filePtr.delete
					if x == "" then
						print(" .. File deleted successfully.")
					else
						error(x)
					end if
				end if
			else if choiceb == 5 then
				if not filePtr.get_content then
					error("Could not read the contents of this file - Check permissions and file type.")
					continue
				else 
					print("Scanning contents...")
					crackPasswordFile(filePtr)
					print("Cracked passwords have been saved in <b><i>" + home_dir + "/crackedPasswords.txt</b></i>")
				end if
			else if choiceb == 6 then
				x = user_input("<b>Please enter what you would like to add to the contents of this file.</b>\n")
				x = filePtr.set_content(filePtr.get_content + char(10) + x)
				if(x == 1) then
					print("File appended successfully.")
				else
					error(x)
				end if			
			end if
		end if
	end while
end function

ipAddr = null

for param in params
	if is_valid_ip(nslookup(param)) then 
		ipAddr = nslookup(param)
	else if is_valid_ip(param) then 
		ipAddr = param
	end if
	if ipAddr then break
end for



print("<color=#FF1111>  *      `           `             ) </color>")
print("<color=#DD4433> (  `       `               `     ( /( </color>")
print("<color=#BB8855> )\))(     (       `  (   `       )\())</color>")
print("<color=#99CC77>((_)()\    )\    (    )(     (   ((_)\ </color>")
print("<color=#77EE99>(_()((_)  ((_)   )\   (()\    )\  __((_)</color>")
print("<color=#5588BB><b>|  \/  |</b>  (_)  ((_)   ((_)  ((_)  <b>\ \/ /</b></color>")
print("<color=#3344DD><b>| |\/| |  | | / _|  | '_| / _ \  >  < </b></color>")
print("<color=#1111FF><b>|_|  |_|  |_| \__|  |_|   \___/ /_/\_\</b></color>")
print("                                <i>Version <b>" + microx_version + "</b></i>")
print()

if not ipAddr then exit("<B>Usage: microx (optional -v) <IP Address></B>")

while 1
	if is_lan_ip(ipAddr) then
		displayLocalMap(ipAddr)
		metaLibs = extractMetaLibs(ipAddr)
	else
		router = getRouter(ipAddr)
		displayRouterMap(router)
		metaLibs = extractMetaLibs(router)
	end if
	
	while 1
		metaLib = chooseMetaLib(metaLibs)
		if not metaLib then exit("Thanks for using microx")
		
		exploits = loadExploits(metaLib.metaLib)
		
		if exploits.len == 0 then
			error("Sorry, there are no exploits for the entry point.  Try scanning for some.")
			print("")
			continue
		end if
		
		break
	end while

	while 1
		// Exploit loop
		choices = ["\n\n<b>Choose which exploit you would like to use:</b>"]
		exploits = loadExploits(metaLib.metaLib)
		for exploit in exploits
			stringToAdd = "<b> " + exploit.type + "</b>"
			if exploit.hasIndex("requirements") then 
				for requirement in exploit.requirements
					stringToAdd = stringToAdd + "\n       " + requirement
				end for
			end if
			choices.push(stringToAdd)
		end for
		choices.push("<i>I'm scared. Get me out of here.</i>")

		userChoice = get_choice(choices, choices.len-1)
		if userChoice > exploits.len then break
		exploit = exploits[userChoice-1]

		exploitObj = runExploit(exploit, metaLib.metaLib)
		
		if typeof(exploitObj) == "shell" or typeof(exploitObj) == "ftpshell" then
			result = get_yesno(false, typeof(exploitObj) + ": This can alert the admin.  Are you sure you want to open it now?")
			if result then
				get_shell.launch("/usr/bin/AdminMonitor.exe")
				exploitObj.start_terminal
			end if
		else if typeof(exploitObj) == "computer" then
			while 1
				choices = ["\n\n<b>You have unlocked a computer object.  You can:</b>"]
				choices.push("Browse through the files.")
				choices.push("Create a file on the computer.")
				choices.push("Mess with users")
				choices.push("Mess with processes")
				choices.push("Scan entire machine for passwords (and crack them)")
				choices.push("Scan entire machine for vulnerable directories and files")
				choices.push("Nothing.")
				choice = get_choice(choices, choices.len-1)
				if choice == choices.len-1 then break
				if choice == 1 then
					browseFiles(exploitObj.File("/"), router.public_ip + "->" + exploitObj.lan_ip)
				else if choice == 2 then
					path = user_input("Path to new file (Do not include file name) >")
					filename = user_input("File name for new file > ")
					x = exploitObj.touch(path, filename)
					if x==1 then
						print("File successfully created at " + path + "/" + filename)
					else
						error(x)
					end if
				else if choice == 3 then 
					messWithUsers(exploitObj)
				else if choice == 4 then
					messWithProcs(exploitObj)
				else if choice == 5 then
					crackAllFiles(exploitObj.File("/"), metaLib.public_ip + " --> " + metaLib.local_ip)
					print("Cracked passwords have been saved in <b><i>" + home_dir + "/crackedPasswords.txt</b></i>")
				else if choice == 6 then
					findUnlocked(exploitObj.File("/"))
				end if
			end while
		else if typeof(exploitObj) == "file" then
			choices = ["\n\n<b>You have unlocked file access.  You can:</b>"]
			choices.push("Browse Files")
			choices.push("Scan entire machine for passwords (and crack them)")
			choices.push("Scan entire machine for vulnerable directories and files")
			choices.push("Nothing.")
			choice = get_choice(choices, choices.len-1)
			if choice == choices.len-1 then break
			if choice == 1 then
				browseFiles(exploitObj)
			else if choice == 2 then
				while exploitObj.parent
					exploitObj = exploitObj.parent
				end while
				crackAllFiles(exploitObj, metaLib.public_ip + " --> " + metaLib.local_ip)
				print("Cracked passwords have been saved in <b><i>" + home_dir + "/crackedPasswords.txt</b></i>")
			else if choice == 3 then
				while exploitObj.parent
					exploitObj = exploitObj.parent
				end while
				findUnlocked(exploitObj)
			end if
		end if
	end while
end while