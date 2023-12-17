color = {};color.white = "<color=#FFFFFF>";color.grey = "<color=#A5A5A5>";color.blue = "<color=#003AFF>";color.cyan = "<color=#00FFE7>";color.purple = "<color=#D700FF>";color.red = "<color=#AA0000>";color.yellow = "<color=#FBFF00>";color.orange = "<color=#FF8701>";color.green = "<color=#00ED03>";color.fill = "><> ><> ><> ><> ><> ><> ><> ><> ><> ><> ><> ><>";color.cap = "</color>";title = "<color=#00FFE7>[<b>SeaShell</b>]</color> ";init = "<color=#00ED03>[SeaShell] <b>init:</b></color> ";error = "<color=#AA0000>[SeaShell] <b>Error:</b></color> ";warning = "<color=#FF8701>[SeaShell] <b>Warning:</b></color> ";color.rainbow = color.red+"R"+color.cap+color.orange+"A"+color.cap+color.cap+color.yellow+"I"+color.cap+color.cap+color.green+"N"+color.cap+color.cap+color.cyan+"B"+color.cap+color.cap+color.blue+"O"+color.cap+color.cap+color.purple+"W"+color.cap;
letters=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
shell=get_shell
computer=shell.host_computer
if active_user!="root" then exit("MUST BE ROOT!")
computer.create_folder("/","home")
fake_names=["Carter", "Mia", "Ethan", "Allison", "Emily", "Ava", "Aaliyah", "Michael", "Robert", "Zoe", "Zoey", "Avery", "Daniel", "Joseph", "Jacob", "Christian", "Aurora", "Ivy", "Luke", "Charles", "Sienna", "Mateo", "Nathan", "Keira", "Madelyn", "Jeremiah", "Theodore", "Dylan", "Logan", "Cameron", "Benjamin", "Lily", "Elijah", "Alexa", "Josiah", "Hannah", "Asher", "David", "Leo", "Emma", "Isabella", "Aiden", "Bailey", "Levi", "Riley", "Jonathan", "Andrew", "Grayson", "Sofia", "Henry", "Samantha", "Grace", "Natalie", "Mason", "Lincoln", "Camila", "Liam", "John", "Nevaeh", "Maya", "Hunter", "Penelope", "Lucas", "Brooklyn", "Camille", "Skylar", "Addison", "Paisley", "Amelia", "Samuel", "Isaiah", "Jack", "Wyatt", "Adrian", "Madison", "Chloe", "Harper", "Evelyn", "Lucy", "Audrey", "Anthony", "Isaac", "Jackson", "Ella", "Leah", "Owen", "Abigail", "Aubrey", "Christopher", "James", "Ryan", "Scarlett", "Charlotte", "Aaron", "Stella", "Jaxon", "Hudson", "Victoria", "Sebastian", "Arianna"]
fake_email_domains=[".info",".net",".com",".org"]
fake_email_providers=["ucblonwficpl", "ahlffkbrviuwb", "kdubckuzdy", "blafosjex", "twhxkkjksyamy", "dechscopflum", "aqfnlgjzizkd", "sosusydxcvqm", "pqxntrnzj", "dywadijh", "taemzadps", "pjardwoanvtps", "vmwutlpdgvrp", "qxdxjpwtw", "lsnojavo", "lvcmugkvtdq", "xqusakl", "gbsoopxig", "ufvvgpnbhsw", "xwqwveitrzj", "hvdkrlsxethap", "fpqhfupjpntfm", "fqnqaclukrz", "iazpwirvan", "cljnzzzbrmbsw", "yeaykmian", "jsmxetx", "arjtxiipt", "ehkgcylzfmrhm", "gbftmjmurxon", "qlpiqgx", "lwwqsaekoup", "wrwuygjffnvud", "enzelxailzrct", "ghkpazxd", "blfbcfbtdikd", "ytsvmymann", "xfmkcpirhai", "khykifi", "iowtblb", "sdhbeaybaxb", "zlrcdmidiup", "zncgwlm", "mspkkampvxvu", "gybhjyyybl", "awcgykbgczoge", "unucuzqlbtbv", "xbqnrtqwtdx", "eofpiuog", "xcbycwrjf", "dgjhyxk", "kowppxyco", "gzrzgfatujrq", "fwapfkosyicw", "vhyhxaczwr", "trlavoz", "dohmitk", "boiuvbvxanzs", "ksvkprkeu", "nbysbxaixjc", "hskjnglr", "rritkohawju", "sxjizcxzy", "rzukllofw", "bwfarhdhrw", "quviasrfzpyqt", "swacvraqoqo", "xlbzwirxro", "kqdcqicwf", "fvgpyovbglm", "clvcsuxjpww", "gujzvpr", "suhtuziktkgh", "pswpehwkssia", "dwcjezpiayyf", "yaqwszcs", "swohwaztsgnf", "xqijoyopyme", "kgyfcbdxf", "brxpojdam", "bgwwrxqx", "tbaiiyzi", "wvwmzftlwiyp", "kxkouhattsdae", "ayffklspsuu", "rllskxotckum", "zpugkqfte", "wipddetodmkc", "sluclxlmhe", "eajgvbekhbg", "iuhcfhek", "bvekxhwddy", "swuqtsvyxgxfe", "fomrcfdgxq", "lbholelo", "tejabfvynzxc", "boncfhz", "hlyippruia", "dafpwua", "ryqmmkcyun"]
fake_user_passwords=["fwh", "ttnjwo", "rtgdyby", "lbdbtxs", "kaq", "irx", "obxzc", "exaqm", "tpz", "cglvbvmi", "kzd", "qdai", "meuluiiy", "rufsaj", "skvj", "owmplhsj", "lgey", "hmuvlz", "rkpqboei", "udq", "fhu", "qwa", "wsl", "jcdilhwm", "togxixc", "cwp", "eef", "cock", "njwhg", "wefaxepu", "nqh", "ofattm", "ademfjdv", "nzfy", "frdcnn", "uegpcqp", "swh", "lqop", "ffldborq", "gcja", "gkgoz", "xuyyjno", "jpl", "tkocd", "ejtsekok", "gmcyu", "cvpoyar", "yczo", "baihexcq", "thjnli", "bwupmn", "zoaxqoli", "ovv", "xlyqh", "bve", "bpx", "gzx", "nmu", "wziue", "gsq", "hor", "wouzbn", "djy", "gafz", "apcvts", "itkdskvy", "pagsl", "eom", "elxv", "uiadz", "etdfgyt", "hugrckzy", "hiu", "rmbcbjsh", "mya", "viwodzd", "hnlyvyb", "wyvkek", "kljhe", "hvcb", "cpxx", "fat", "pijjw", "isvy", "wezwb", "rkzc", "mmthtw", "rdszxqav", "fbip", "msejsza", "heqank", "jbtnkg", "teggl", "yjtvbtnh", "gvtxzz", "vcer", "hqodr", "dgenelm", "unx", "pefir"]
fake_mail_passwords=["kfcbgbk", "pcoq", "mwlgp", "djghx", "vzj", "dkmatrcy", "dqcwuzn", "jqrz", "bznnfcn", "zlttjri", "ovi", "acxvyvq", "jnaym", "axegg", "jgqwg", "uqgkgyw", "qprj", "blal", "xsfc", "yvelwaab", "pxxkys", "zzbub", "bknh", "ybnu", "fkbylw", "bdc", "wwubbdbp", "ksso", "qafylwq", "kjruj", "kkit", "trki", "vwly", "hejd", "xfhjimlf", "jys", "nnrl", "qee", "vismti", "orrqzmkh", "uezboocv", "psn", "mhouu", "pzvm", "ilrmstp", "srt", "nnze", "neoraaj", "gxcvxnr", "eiqfbuk", "drloldee", "cfcgleus", "ytejm", "enxox", "exwluhn", "bjkdhekw", "hulirdi", "nzg", "vfgbf", "sdqoac", "dsjayl", "wbh", "nljoivhk", "ukfrbgb", "pxrbo", "vufgtra", "jwmm", "wajut", "cexbkce", "ljpmq", "qqon", "lzcedwjt", "hsyou", "bsxtlxb", "esvqdk", "dyazy", "tzvrjl", "oyyubysl", "nuv", "ithunyh", "rfxgfup", "kauekah", "kabfkuv", "fvtqm", "ceovb", "eeiaqj", "uqmev", "iippzdc", "vmny", "mszf", "hshaguk", "vpyhlb", "yxuplm", "mjxho", "aafkc", "cqeqewb", "ktfdhodd", "sdmujrep", "cwsnymt", "hrfsj"]
fake_bank_passwords=["beckg", "qxoma", "ertx", "dyzdn", "zzh", "olpsgrb", "sxhgd", "rryoi", "mxn", "qxyu", "hxsurlwy", "svh", "ioqw", "oebkfd", "xbnw", "zsd", "vgw", "qwnqm", "armctz", "zomtxtpr", "lztsoo", "tfka", "kocnb", "ggreejbh", "argajcf", "wjv", "wpleveg", "uuckbcsz", "dfv", "nfucsuz", "cvr", "dnv", "fuwzypp", "yar", "osqa", "dyneqkik", "pshmmd", "mazdsajx", "dgw", "oyhu", "pkhooy", "wuq", "xcofb", "tonaqnz", "otdxpgp", "mqhti", "bltbtjqx", "jzhmiywb", "etpo", "xaf", "omu", "dgbyelkz", "tbvuf", "cjla", "ggw", "wmsitkaz", "rujijisv", "xmjlxaas", "djitfdqx", "kvqayn", "gskq", "vjwla", "bxyuft", "cytatuda", "qwcqucj", "jodl", "jpgq", "apk", "gipi", "kmiyxi", "aouexmq", "wdb", "mep", "pmzrgwx", "auw", "ghqljr", "iblia", "zxeid", "jhydgbo", "vubdtf", "rpdzgttc", "dntfo", "fyl", "ukypicbv", "ohh", "cna", "oinbwap", "vbextlm", "xdo", "ltwx", "vmxbgmqv", "fypvut", "skdzyk", "undozys", "cvvj", "osysebea", "vji", "muymw", "pbj", "lzvkty"]
if computer.File("/home") and computer.File("/home").has_permission("w") then
    account_passwords=[]
    for name in fake_names
        fake_user_passwords.shuffle
        fake_mail_passwords.shuffle
        fake_bank_passwords.shuffle
        fake_email_providers.shuffle
        fake_email_domains.shuffle
        computer.create_folder("/home",name)
        computer.create_folder("/home/"+name,"Config")
        computer.touch("/home/"+name+"/Config","Bank.txt")
        fake_email_address=fake_email_providers.pop+fake_email_domains[0]
        bank_number=letters[floor(rnd*25)]+floor(rnd*10)+letters[floor(rnd*25)]+letters[floor(rnd*25)].lower+letters[floor(rnd*25)]+letters[floor(rnd*25)]+letters[floor(rnd*25)]+letters[floor(rnd*25)].lower
        computer.File("/home/"+name+"/Config/Bank.txt").set_content(bank_number+"-"+fake_email_address+":"+md5(fake_bank_passwords.pop))
        computer.touch("/home/"+name+"/Config","Mail.txt")
        computer.File("/home/"+name+"/Config/Mail.txt").set_content(fake_email_address+":"+md5(fake_mail_passwords.pop))
        computer.create_folder("/home/"+name,"Desktop")
        computer.create_folder("/home/"+name,"Downloads")
        account_passwords.push(name+":"+md5(fake_user_passwords.pop))
        yield
    end for
    for item in account_passwords
        computer.File("/etc/passwd").set_content(computer.File("/etc/passwd").get_content+item+char(10))
    end for
end if

for item in fake_user_passwords
	get_shell.host_computer.change_password("guest",item)
	yield
end for
for item in fake_mail_passwords
	get_shell.host_computer.change_password("guest",item)
	yield
end for
for item in fake_bank_passwords
	get_shell.host_computer.change_password("guest",item)
	yield
end for