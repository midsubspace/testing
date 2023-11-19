//gotten from https://github.com/fera282828/Greyhack/blob/main/sudo.gs

input = user_input("Classified: ", 1)
input2 = user_input("Classified: ", 1)
if input == "answer1" and input2 == "answer2" then // Security questions answers
	shell = get_shell("root", "YOUR_PASS_HERE")
	shell.start_terminal
else
	print("It's... classified")
end if