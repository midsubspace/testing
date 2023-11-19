//gotten from https://github.com/fera282828/Greyhack/blob/main/processMonitor.src
colors = ["red", "green", "blue", "yellow", "purple", "grey", "white"]
r = []
procIndex = 0
lastColor = null
print("-- PROCESS MONITOR --")
while true
	if r.len == 0 then
		r = range(0, colors.len - 1)
	end if

	procs = comp.show_procs()
	procs = procs.split("\n")
	procs.pull
	
	if procs.len > procIndex then
		r.shuffle()
		currentColor = r.pull
		if currentColor == lastColor then currentColor = r.pull
		print("<b><color=white>" + current_date + "</b></color>")
		print("<b><color=" + colors[currentColor] + ">NEW PROCESS FOUND:</b></color>\n" + procs[-1])

		lastColor = currentColor
	end if
	procIndex = procs.len
end while