mission_finder=function()
    //mail_box=mail_login(user_input("Email Address:"),user_input("Password:",true))
    mail_box=mail_login("test@rizol.org","test")
    while typeof(mail_box)!="MetaMail";clear_screen;print("Either username/password is incorrect");mail_box=mail_login(user_input("Email Address:"),user_input("Password:",true));end while
    emails=mail_box.fetch
	missions=[]
	num=0
	for email in emails
		subject=emails[num].split(char(10))[4]
		if subject.split(":")[1]==" Mission Contract" then missions.push(emails[num])
		num=num+1
	end for
    if missions.len==0 then exit("No Missions Found!")
    num=0
    for mission in missions
		lines=mission.split(char(10))
		type=lines[3].split(" ")
        print(num+1+")"+type)
        num=num+1
    end for
    choice=user_input("Which Mission Number To Select? ").val//add in check to make sure choice is valid
    clear_screen
	id=missions[choice-1].split(char(10))[2]
    mission=mail_box.read(id.split(":")[1].split(" ")[1])
	
	mission_parser=function(mission)
		lines=mission.split(char(10))
		get_shell.host_computer.File(home_dir+"/email").set_content(lines)
		if lines[3].split(" ").indexOf("wants")!=null then type="corrupt"
		if lines[3].split(" ").indexOf("credentials")!=null then type="creds"
		if lines[3].split(" ").indexOf("police")!=null then type="police"
		if lines[3].split(" ").indexOf("academic")!=null then type="school"
		if lines[3].split(" ").indexOf("delete")!=null then type="find_file_delete"
		if lines[3].split(" ").indexOf("enter")!=null then type="find_file_send"
		if type=="school" then
			public_ip=lines[3].split("<b>")[1]
			lan_ip=lines[4].split("<b>")[1]
			student=lines[8].split("<b>")[1]
			subject=lines[9].split("<b>")[1]
			print("Public IP:"+public_ip)
			print "Lan IP:"+lan_ip
			print "Student:"+student
			print "Subject:"+subject
		end if
		if type=="creds" then
			goal=lines[3]
			print "Goal:"+goal
			public_ip=lines[4].split("<b>")[1].split("</b>")[0]
			print("Public:"+public_ip)
			lan_ip=lines[4].split("<b>")[2]
			print "Lan IP:"+lan_ip
		end if
		if type=="police" then
			public_ip=lines[4].split("<b>")[1]
			print "Public IP:"+public_ip
			inmate=lines[6].split("<b>")[1]
			print "Inmate:"+inmate
			goal=lines[7]
			print "Goal:"+goal
		end if
		if type=="corrupt" then
			public_ip=lines[4].split("<b>")[1].split("</b>")[0]
			print "Public IP:"+public_ip
			goal=lines[3]
			print "Goal:"+goal
			lan_ip=lines[4].split("<b>")[2]
			print "Lan IP:"+lan_ip
		end if
		if type=="find_file_delete" then
			public_ip=lines[5].split("<b>")[1].split("</b>")[0]
			print "Public IP:"+public_ip
			goal=lines[3]
			print "Goal:"+goal
			lan_ip=lines[5].split("<b>")[2].split(" ")[0]
			print "Lan IP:"+lan_ip
		end if
		if type=="find_file_send" then
			public_ip=lines[5].split("<b>")[1].split("</b>")[0]
			print "Public IP:"+public_ip
			goal=lines[3]
			print "Goal:"+goal
			lan_ip=lines[5].split("<b>")[2].split(" ")[0]
			print "Lan IP:"+lan_ip
			path=lines[5].split("<b>")[3]
			print("File Path:"+path)
		end if
	
	end function
	mission_parser(mission)
end function
mission_finder()

