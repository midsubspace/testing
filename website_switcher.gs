shell=get_shell("root","test")
device=shell.host_computer
bank=device.File("/root/websites/bank.html")
isp=device.File("/root/websites/isp.html")
shop=device.File("/root/websites/shop.html")
police=device.File("/root/websites/police.html")
mail=device.File("/root/websites/mail.html")

if params.len>0 then 
	if params[0]=="bank" then
		bank.copy("/Public/htdocs","website.html")
	else if params[0]=="isp" then
		isp.copy("/Public/htdocs","website.html")
	else if params[0]=="shop" then
		shop.copy("/Public/htdocs","website.html")
	else if params[0]=="police" then
		police.copy("/Public/htdocs","website.html")
	else if params[0]=="shop" then
		mail.copy("/Public/htdocs","website.html")
	else
		print("Broke")
	end if
else
	print("website [bank or isp or shop or police or mail]")
end if