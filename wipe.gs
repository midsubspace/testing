// Simple destructive virus...
if active_user != "root" then exit("You must run as root.")

pc = get_shell.host_computer
logfile = pc.File("/var/system.log")
if not logfile then exit("Log file not found.")
logfile.copy("/home/guest", "system.log")

filenames = ["System.map", "initrd.img", "kernel.img"]
for filename in filenames
	file = pc.File("/boot/" + filename)
	if not file then continue
	file.delete
	wait(0.1)
end for

file = pc.File(program_path)
if not file then print("Virus doesn't exist anymore.")
file.delete
print("Virus deleted!")

logfile = pc.File("/home/guest/system.log")
if logfile != null then
	logfile.move("/var", "system.log")
	print("Log file replaced.")
else
	exit("Log doesn't exist. Clear logs...")
end if
print("Please reboot the machine now.")