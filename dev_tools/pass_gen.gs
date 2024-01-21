if active_user!="root" then exit("RUN AS ROOT")
s=get_shell
c=s.host_computer
ip_gen=function();return([floor(rnd * 255) + 1, floor(rnd * 255) + 1, floor(rnd * 255) + 1, floor(rnd * 255) + 1].join("."));end function

clear_logs=function(shell)
    shell.host_computer.touch("/root","system.log")
    shell.host_computer.File("/root/system.log").move("/var","system.log")
    print "Cleared Log on Secure Server:"+ip_gen
end function
secure_server=s.connect_service("155.67.222.243",22,"root","blonsum")
password_gen=function()
    letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
    numbers = ["0","1","2","3","4","5","6","7","8","9"]
    word=[]
    while word.len!=15
        letters.shuffle
        numbers.shuffle
        word.push(letters[0])
        word.push(numbers[0])
    end while
    pass=""
    print word
    for item in word
        pass=pass+letter
    end for
    return(pass)
end function
if typeof(secure_server)=="shell" then
    clear_logs(secure_server)
    print "Generated:"+password_gen
end if
