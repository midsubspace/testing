input = @user_input
map1 = {}
map2 = {}
lett = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
numb = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]

encode = function(let, message)
	A = ceil(rnd * 29)

	while A < 5
		A = ceil(rnd * 29)
	end while

	mess = message
	letters = let
	encoded = []
	print("Key:" + A)

	for let in letters
		if map1.hasIndex(1) then
			if map1.indexOf(let) != null then
				encoded.push((map1.indexOf(let) + A))
			end if

		end if

	end for

	return (encoded)
end function

decode = function(k)
	fullde = ""
	t = "null"
	numbers = []
	sen = []

	while t != "done"
		
		if t == "done" then
			continue
		end if
		t = input("Numbers (one at a time when done type ""done""):")
		numbers.push(t.to_int)
	end while

	while numbers.len > 1
		sen.push((map2.indexOf(numbers.pull - k)))
		//t=input("Numbers 1 at a time:")
	end while

	while sen.len > 0
		fullde = fullde + sen.pull
	end while

	print(fullde)
end function

op = input("Encode(1) or Decode(0)").to_int

if op == 1 then
	while lett.len != 0 and numb.len != 0
		letter = lett.pull
		number = numb.pull
		map1[number] = letter
	end while

	message = input("Message:").lower
	letters = message.values
	coded = encode(letters, message)
	print(coded)
end if

if op == 0 then
	while lett.len != 0 and numb.len != 0
		letter = lett.pull
		number = numb.pull
		map2[letter] = number
	end while
	decode(input("Your Key Please:").to_int)
end if
