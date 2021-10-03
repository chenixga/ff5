/**

The ff5se_20 has webpage interface to edit the save.bin of all Final Fantasy 5 remaster versions (Steam/Android/IOS):
http://chenixga.atspace.cc/ff/ff5se_20.html
Tested with Chrome, Firefox in Windows, Android/Nexus7, and OSX.

 * 
 * chenixga@gmail.com
 *
$(function() {
	$('div.ff5-file').hide();
});
*/
var bin = {};
var ff5File = {};
var startLoad, loadTime = 0;
var startSave, saveTime = 0;

function bind(obj, id) {
	let isValue = function(obj) {
		var type = typeof(obj);
		return (type === 'number' || type === 'string' || type === 'boolean');
	}
	//console.log("bind ~"+id)
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            var propId = id? id+'-'+prop : prop;
            var member = obj[prop];
            var elem = document.getElementById(propId);
            if (elem && isValue(member)) {
            	bindElem(obj, prop, elem);
            } else if (Array.isArray(member)) {
            	for(var i = 0; i < member.length; i++ ) {
            		var itemId = propId + i;
                	bind(member[i], itemId);
            	}
            } else if (typeof(member) === 'object') {
            	bind(member, propId);
            }
        }
    }
}

function bindElem(obj, prop, elem) {
	//console.log("bindElem "+elem)
	if (elem.tagName == 'INPUT' ) {
		if (elem.type == 'checkbox' ) {
			elem.checked = obj[prop];
			elem.onclick = function(){
				obj[prop] = elem.checked;
			};
		} else { // === text
			elem.value = obj[prop];
			var onchange = function(){
				obj[prop] = elem.value;
			};
			elem.onkeypress = onchange;
			elem.onchange = onchange;
			elem.oninput = onchange;
		}
	} else {
		elem.textContent = obj[prop];
	}
}

function loadFile() {
	var input, file, fileReader;
 
    if (typeof window.FileReader !== 'function') {
        bodyAppend("p", "The file API isn't supported on this browser yet.");
        return;
    }
    input = document.getElementById('file-input');
    if (!input) {
        bodyAppend("p", "Um, couldn't find the fileinput element.");
    } else if (!input.files) {
        bodyAppend("p", "This browser doesn't seem to support the `files` property of file inputs.");
    } else if (!input.files[0]) {
        bodyAppend("p", "Please select a file before clicking 'Load'");
    } else {
        file = input.files[0];
        fileReader = new FileReader();
        fileReader.onload = displayFile;
        fileReader.readAsArrayBuffer(file);
    }
    
	function characters() {
		[ "Bartz", 
		  "Lenna", 
		  "Galuf", 
		  "Faris", 
		  "Krile" 
		].forEach( (name,index) => {
            $('div.ff5-file').append("<b><p id='"+name+"'>"+name+" Exp: <input id='"+name+"-Exp'/></p></b>");
            let jobt = "<table>";
            for(let i = 0; i < 25; i++) {
                if(i%3==0) jobt = jobt+"<tr>";
                jobt = jobt+("<td><span id='"+name+"-jobs"+i+"-name'/></span></td>"); //style='width: 1em;' 
                jobt = jobt+("<td>Lv:<input id='"+name+"-jobs"+i+"-int1' maxlength='1' style='width: 1em;'/>");
                jobt = jobt+("ABP:<input id='"+name+"-jobs"+i+"-int2' maxlength='3' style='width: 3em;'/></td>" );
                if(i%3==2) jobt = jobt+"</tr>";
            } jobt = jobt+"</tr>";
			$('div.ff5-file').append(jobt + "</table>");
        }); 
	}
	
	function inventory() {    
		let inv =("<b><p id='Items'>Items</p></b>");      
        inv = inv +("<table>");
        for(let i = 0; i < 261; i++) {
            if(i%5==0) inv = inv +("<tr>");
            inv = inv +
			  ("<td><input id='items"+i+"-int1' style='width: 3em;' maxlength='3' /></td>") +
			  ("<td><span id='items"+i+"-name'/></span></td>"); //style='width: 1em;' 
            if(i%5==4) inv = inv +("<tr>");
        } inv = inv + ("</tr>");  
		$('div.ff5-file').append(inv + "</table>");    
    }
	
    function allJobs() {  
        let jobs = ("<b><p id='Jobs'>Jobs Learned</p></b>");        
        jobs = jobs+("<table>");
        for(let i = 0; i < 32; i++) {
		    if(i%5==0) jobs = jobs+("<tr>");
			jobs = jobs+
			  ("<td><input type='checkbox' id='jobs"+i+"-bit'></input></td>")+
			  ("<td><span id='jobs"+i+"-name'/></span></td>");//style='width: 1em;' 
            if(i%5==4) jobs = jobs+("</tr>");
         } jobs = jobs+("</tr>");
		$('div.ff5-file').append(jobs + "</table>");      
    }
	
    function magicSkills() {  
         var skills = ("<b><p id='Magic'>Magic/Skills Learned</p></b>");        
         skills = skills+("<table>");
         for(let i = 0; i < 336; i++) {
             if(i%5==0) skills = skills+("<tr>");
			 skills = skills+
			   "<td><input type='checkbox' id='mgks"+i+"-bit'></input></td>" +
               "<td><span id='mgks"+i+"-name'/></span></td>"; //style='width: 1em;' 
             if(i%5==4) skills = skills+("</tr>");
         } skills = skills+("</tr>");
		$('div.ff5-file').append(skills + "</table>");  
     }
	
	function bestiary() {      
        let bes = ("<b><p id='Bestiary'>Bestiary</p></b>");      
        bes = bes+("<table>");
        for(let i = 0; i < 450; i++) {
            if(i%5==0) bes = bes+"<tr>";
			bes = bes+
			  "<td><input id='slains"+i+"-int4' style='width: 3em;' maxlength='3' /></td>"+
              "<td><span id='slains"+i+"-name'/></span>:</td>"; //style='width: 1em;' 			
            if(i%5==4) bes = bes+"</tr>";
        } bes = bes+"</tr>";
		$('div.ff5-file').append(bes + "</table>");     
    }

    function displayFile() {
    	$('div.description').hide();
		characters();
		inventory();
		allJobs();
		magicSkills();
		bestiary();
    	$('div.ff5-file').show();
    	startLoad = Date.now();
	    bin = new Bin(fileReader.result);
	    var fileNumber = parseInt($('input[name=file-number]:checked').val());
	    var allJobsABP = parseInt($('#all-jobs-abp').val());
	    if (allJobsABP && allJobsABP > 32639) allJobsABP = 32639
	    bin.options = {
	    	allJobsABP: allJobsABP, //max 32639
	    	allItems: parseInt($('#all-items').val()),
	    	allMagic: $('#all-magic').is(':checked'),
	    	//bestiary: $('#bestiary').is(':checked'),
	    	allSlain: parseInt($('#all-slain').val())
	    };
        ff5File = new FF5File(bin, fileNumber);
    	startLoad = Date.now();
        // Activates knockout.js
        //ko.applyBindings(ff5File); //800|1400(debug)
        bind(ff5File); 
        //bind(ff5File);
        //loadTime = Date.now() - startLoad; 
        var menu = $('ul.menu').text('').css({
            width: '16%',
            verticalAlign: 'top',
            right: '10px',
            top: '5em',
            position: 'absolute'
        });
        var liStyle = {
            border: 'thin solid #82adf2',
            borderRadius: '4px',
            marginBottom: '1em',
            padding: '5px',
            backgroundColor: '#82adf2', //'#fcf8e3',
            borderColor: '#82adf2', //'#faebcc',
            color: '#21447c', //'#8a6d3b',
            cursor: 'pointer'
        }
        var scrollTo = function(id) {
            $('html, body').animate({ scrollTop: $('#'+id).offset().top }, 0);
        };
        ['Bartz', 'Lenna', 'Galuf', 'Faris', 'Krile', 
         'Items', 'Jobs',  'Magic', 'Bestiary'].forEach(function(name, i){
            var liChar = $('<li>').html(name).css(liStyle).click(function(){scrollTo(name)});
            menu.append(liChar);	
        });
        var liload = $('<li>').html('Reload').css(liStyle).click(loadFile);
        menu.append(liload);
        var liSave = $('<li>').html('Save').css(liStyle).click(saveFile);
        menu.append(liSave);
        var lReset = $('<li>').html('Reset').css(liStyle).click(function(){
        	location.reload();
        });
        menu.append(lReset);
        var menuTop = $('#menu').offset().top - 15;
        $(window).scroll(function() {
            if (menuTop < $(window).scrollTop()) {
                $('#menu').css('position', 'fixed').css('top', '10px');
            } else {
                $('#menu').css('position', 'absolute').css('top', '');
            }
        });
        loadTime = Date.now() - startLoad; //1000|1632(debug) //+ debug
        $('#status').text("loadTime: " + loadTime);
    }
}

function saveFile() {
	startSave = Date.now();
	ff5File.save();
	var blob = new Blob([bin.bytes.buffer]);
	saveAs( blob, "save.bin");
    saveTime = Date.now() - startSave; 
    $('#status').text("saveTime: " + saveTime);
}

function Bin(arrayBuffer) {
	this.bytes = new Int8Array(arrayBuffer);
	
	this.getByte = function(addr) {
		return this.bytes[addr];
	}

	this.getInt = function(addr,  digit) {
		if (digit == 1)
			return int1(this.bytes[addr]);
		if (digit == 2)
			return int2(this.bytes[addr], this.bytes[addr + 1]);
		if (digit == 4)
			return int4(this.bytes[addr], this.bytes[addr + 1], this.bytes[addr + 2], this.bytes[addr + 3]);
		return 0;
	}

	this.setInt = function(addr, value, digit) {
		var b = 
			(digit == 1) ? [value >>> 0]:
		    (digit == 2) ? [value >>> 0, value >>> 8]: bytes(value);
		this.bytes.set(b, addr); 
		return this;
	}
	
	//Int of SingleByte
	this.getInt1s = function(offset, length) {
		var ones = [];
		for(var i = 0; i < length; i++) {
			ones.push({int1: this.getInt(offset+i, 1)});
		} return ones;
    }
    this.setInt1s = function(offset, ones) {
    	for (var i = 0; i < ones.length; i++) {
    		this.setInt(offset+i, ones[i].int1, 1);	
    	} return this;
    }
    //Int of DoubleByte
	this.getInt2s = function(offset, length) {
		var int2s = [];
		for(var i = 0; i < length; i++) {
			int2s.push({int2: this.getInt(offset+(i*2), 2)});
		} return int2s;
    }
    this.setInt2s = function(offset, int2s) {
    	for (var i = 0; i < int2s.length; i++) {
    		this.setInt(offset+(i*2), int2s[i].int2, 2);	
    	} return this;
    }
    //Int of QuardrupleByte
	this.getInt4s = function(offset, length) {
		var int4s = [];
		for(var i = 0; i < length; i++) {
			int4s.push({int4: this.getInt(offset+(i*4), 4)});
		} return int4s;
    }
    this.setInt4s = function(offset, int4s) {
    	for (var i = 0; i < int4s.length; i++) {
    		this.setInt(offset+(i*4), int4s[i].int4, 4);	
    	} return this;
    }
    
    //8Bits
    this.getBits = function(offset, length) {
		var bits = [];
		for(var i = 0; i < length; i++) {
			var int = int1(this.getByte(offset+i));
			for (var b = 0; b < 8; b++) {
				bits.push({bit: bool((int >> b) & 1)});
			}
		}
		return bits;
    }
    this.setBits = function(offset, bits) {
		var length = bits.length/8;
    	for (var i = 0; i < length; i++) {
    		this.setInt(offset+i, this.toInt1(bits, i*8), 1);	
    	} return this;
    }
    
    this.toInt1 = function(bits, offset) {
    	var int = 0;
		for (var b = 0; b < 8; b++) {
			if (bits[offset+b].bit)  {
				int += Math.pow(2, b);
			}
		}
		return int;
    }
}

function FF5File(bin, fid) {
	const BestiaryOffset = 540;
	const BestiaryLength = 450;//@540(0000021C) ~ @2336(00000920) 
	const ItemsOffset = 37;//id starting from 1
	const ItemsLength = 261;// 240 or 261      
	const JobsBytesOffset = 27;//id starting from 1
	const JobsBytesLength = 4; //JobsLength = 25 < JobsBytesLength(4) x 8 = 32; 7 Bits not used
	const MagicBytesOffset = 952;//id starting from 1
	const MagicBytesLength = 42; //42*8 = 336 magics ...
	
	var offset = 8192*fid;

//    <p>xill: <input id='Xill'/></p>
//    <p>yill: <input id='Yill'/></p>
	//this.Xill = bin.getInt(offset+32, 4);
	//this.Yill = bin.getInt(offset+32, 4);
	this.Gill = bin.getInt(offset+32, 4);
	
	this.Bartz = new Char(bin, offset+1100+260*0);
	this.Lenna = new Char(bin, offset+1100+260*1);
	this.Galuf = new Char(bin, offset+1100+260*2);
	this.Faris = new Char(bin, offset+1100+260*3);
	this.Krile = new Char(bin, offset+1100+260*4);	

	this.items = bin.getInt1s(offset+ItemsOffset, ItemsLength).map(function(one, i) {
		return { name: itemName(i), int1: (bin.options.allItems?bin.options.allItems:one.int1) };
		//return { name: itemName(i), int1: (i<230)?i:(i-230) }; //one.int1
	});	
	
	//this.jobs = [{bit: false}, {bit: true}, {bit: false}];
	this.jobs = bin.getBits(offset+JobsBytesOffset, JobsBytesLength).map(function(b, i) {
		return { name: JobName[i], bit: b.bit };
	});

	this.mgks = bin.getBits(offset+MagicBytesOffset, MagicBytesLength).map(function(b, i) {
		return { name: magicName(i), bit: (bin.options.allMagic?bin.options.allMagic:b.bit) }; //b.bit 
	});
	//bin.options.bestiary? 
	this.slains = bin.getInt4s(BestiaryOffset, BestiaryLength).map(function(int4, i) {
//		return { name: 'mon'+i, int4: i };
		return { name: 'mon'+i, int4: (bin.options.allSlain?bin.options.allSlain:int4.int4)}; //b.bit 
	});
	
	this.save = function() {
        this.Bartz.save();
        this.Lenna.save();
        this.Galuf.save();
        this.Faris.save();
        this.Krile.save();
        bin.setInt(offset+32, parseInt(this.Gill), 4)
           .setInt1s(offset+ItemsOffset, this.items)
           .setBits(offset+JobsBytesOffset,  this.jobs)
           .setBits(offset+MagicBytesOffset, this.mgks)
           .setInt4s(BestiaryOffset, this.slains);
		var sum = 0;
        for (var i = 0; i < 5036; i++) sum+=bin.getByte(offset+i);
        bin.setInt(offset+5036, sum, 4);
	};
}

function Char(bin, offset)  {
	const JobsOffset = 14;
	const JobsLength = 25; // < JobsBytesLength(4) x 8 = 32; 7 Bits not used
	const ABPsOffset = 44;
	
	this.Exp = bin.getInt(offset, 4); //1stChar@9292|244C~@9295|244F

	var int1s = bin.getInt1s(offset+JobsOffset, JobsLength);
	var int2s = bin.getInt2s(offset+ABPsOffset, JobsLength);
	
	this.jobs = []
	for(var i = 0; i < JobsLength; i++) {
		this.jobs.push({name: JobName[i+2], int1: int1s[i].int1, int2:(bin.options.allJobsABP?bin.options.allJobsABP:int2s[i].int2)});
	};
	
	this.save = function() {
		bin.setInt(offset, parseInt(this.Exp), 4)
		   .setInt1s(offset+JobsOffset, this.jobs)
		   .setInt2s(offset+ABPsOffset, this.jobs);
	};
}

function int1(b1) {
	return b1 & 0xff;
}

function int2(b1, b2) {
	return b1 & 0xff | (b2 << 8) & 0xff00;
} 

function int4(b1,  b2,  b3, b4) {
	return b1 & 0xff | (b2 << 8) & 0xff00 | (b3 << 16) & 0xff0000 | (b4 << 24) & 0xff000000;
} 

function bytes(value) {
	return [value >>> 0, value >>> 8, value >>> 16, value >>> 24];
}

function bool(bit) {
	return (bit===0)?false:true;
}

function bodyAppend(tagName, innerHTML) {
    var elm = document.createElement(tagName);
    elm.innerHTML = innerHTML;
    document.body.appendChild(elm);
}


function itemName(i) { 
	let name = ItemNames.get(i)
	return (name)? name : 'item-'+i +' ???';
}

function magicName(i) { 
	let name = MagicNames.get(i)
	return (name)? name : 'mgk-'+i +' ???';
}

const JobName = ['Hello', 
  'Knight', 'Monk', 'Thief', 'Dragon', 'Ninja', 
  'Samurai', 'Berserker', 'Ranger', 'MysticKnight', 'WhiteMage', 
  'BlackMage', 'TimeMage', 'Summoner', 'BlueMage', 'RedMage', 
  'BeastMaster', 'Chemist', 'Geomancer', 'Bard', 'Dancer', 
  'Necromancer', 'Oracle', 'Cannoneer', 'Gladiator', 'Mime', 
  '26 ???', '27 ???', '28 ???', '29 ???', '30 ???', 
  '31 ???', '32 ???', '33 ???', '34 ???', '35 ???'
];

const ItemNames = new Map([
  [0, "Potion"],
  [1, "Hi-Potion"],
  [2, "Phoenix Down"],
  [3, "Ether"],
  [4, "Antidote"],
  [5, "Eye Drops"],
  [6, "Gold Needle"],
  [7, "Maiden's Kiss"],
  [8, "Mallet"],
  [9, "Holy Water"],
  [10, "Tent"],
  [11, "Cottage"],
  [12, "Elixir"],
  [13, "Goliath Tonic"],
  [14, "Power Drink"],
  [15, "Speed Shake"],
  [16, "Iron Draft"],
  [17, "Hero Cocktail"],
  [18, "Turtle Shell"],
  [19, "Dragon Fang"],
  [20, "Dark Matter"],
  [21, "Magic Lamp"],
  [22, "Flame Scroll"],
  [23, "Water Scroll"],
  [24, "Lightning Scroll"],
  [25, "Ash"],
  [26, "Shuriken"],
  [27, "Fuma Shuriken"],
  [28, "Buckshot"],
  [29, "Blastshot"],
  [30, "Blitzshot"],
  [31, "Ramuh"],
  [32, "Catoblepas"],
  [33, "Golem"],
  [34, "Dragon Seal"],
  [35, "Omega Badge"],
  [36, "Medal of Smithing"],
  [37, "Knife"],
  [38, "Dagger"],
  [39, "Mythril Knife"],
  [40, "Mage Masher"],
  [41, "Main Gauche"],
  [42, "Orichalcum Dirk"],
  [43, "Dancing Dagger"],
  [44, "Air Knife"],
  [45, "Theif Knife"],
  [46, "Assassin's Dagger"],
  [47, "Man-Eater"],
  [48, "Gladius"],
  [49, "Chicken Knife"],
  [50, "Kunai"],
  [51, "Kodachi"],
  [52, "Sasuke's Katana"],
  [53, "Kagenui"],
  [54, "Broadsword"],
  [55, "Long Sword"],
  [56, "Mythril Sword"],
  [57, "Coral Sword"],
  [58, "Ancient Sword"],
  [59, "Sleep Blade"],
  [60, "Rune Blade"],
  [61, "Great Sword"],
  [62, "Excalipoor"],
  [63, "Enhancer"],
  [64, "Ultima Weapon"],
  [65, "Flametongue"],
  [66, "Icebrand"],
  [67, "Blood Sword"],
  [68, "Defender"],
  [69, "Excalibur"],
  [70, "Ragnarok"],
  [71, "Apocalypse"],
  [72, "Brave Blade"],
  [73, "Spear"],
  [74, "Mythril Spear"],
  [75, "Trident"],
  [76, "Wind Spear"],
  [77, "Heavy Lance"],
  [78, "Javelin"],
  [79, "Twin Lance"],
  [80, "Partisan"],
  [81, "Holy Lance"],
  [82, "Dragon Lance"],
  [83, "Longinus"],
  [84, "Battle Axe"],
  [85, "Mythril Hammer"],
  [86, "Ogre Killer"],
  [87, "War Hammer"],
  [88, "Death Sickle"],
  [89, "Poison Axe"],
  [90, "Gaia Hammer"],
  [91, "Rune Axe"],
  [92, "Thor Hammer"],
  [93, "Titan's Axe"],
  [94, "Earthbreaker"],
  [95, "Ashura"],
  [96, "Wind Slash"],
  [97, "Osafune"],
  [98, "Kotetsu"],
  [99, "Kiku-ichimonji"],
  [100, "Murasame"],
  [101, "Masamune"],
  [102, "Murakumo"],
  [103, "Mutsunokami"],
  [104, "Rod"],
  [105, "Flame Rod"],
  [106, "Frost Rod"],
  [107, "Thunder Rod"],
  [108, "Poison Rod"],
  [109, "Lilith Rod"],
  [110, "Magus Rod"],
  [111, "Wonder Wand"],
  [112, "Demon's Rod"],
  [113, "Staff"],
  [114, "Healing Staff"],
  [115, "Power Staff"],
  [116, "Staff of Light"],
  [117, "Sage's Staff"],
  [118, "Judgement Staff"],
  [119, "Mace of Zeus"],
  [120, "Flail"],
  [121, "Morning Star"],
  [122, "Silber Bow"],
  [123, "Flame Bow"],
  [124, "Frost Bow"],
  [125, "Thunder Bow"],
  [126, "Dark Bow"],
  [127, "Magic Bow"],
  [128, "Killer Bow"],
  [129, "Elven Bow"],
  [130, "Hayate Bow"],
  [131, "Aevis Killer"],
  [132, "Yoichi's Bow"],
  [133, "Artemis Bow"],
  [134, "Fairy's Bow"],
  [135, "Silver Harp"],
  [136, "Dream Harp"],
  [137, "Lamia's Harp"],
  [138, "Apollo's Harp"],
  [139, "Whip"],
  [140, "Blitz Whip"],
  [141, "Chain Whip"],
  [142, "Beast Killer"],
  [143, "Fire Lash"],
  [144, "Dragon's Whisker"],
  [145, "Diamond Bell"],
  [146, "Gaia Bell"],
  [147, "Rune Chime"],
  [148, "Tinklebell"],
  [149, "Moonring Blade"],
  [150, "Rising Sun"],
  [151, "Leather Shield"],
  [152, "Bronze Shield"],
  [153, "Iron Shield"],
  [154, "Mythril Shield"],
  [155, "Golden Shield"],
  [156, "Aegis Shield"],
  [157, "Diamond Shield"],
  [158, "Flame Shield"],
  [159, "Ice Shield"],
  [160, "Crystal Shield"],
  [161, "Genji Shield"],
  [162, "Force Shield"],
  [163, "Leather Cap"],
  [164, "Plumed Hat"],
  [165, "Hypno Crown"],
  [166, "Royal Crown"],
  [167, "Green Beret"],
  [168, "Twist Headband"],
  [169, "Tiger Mask"],
  [170, "Black Cowl"],
  [171, "Lamia's Tiara"],
  [172, "Wizard's Hat"],
  [173, "Sage's Miter"],
  [174, "Circlet"],
  [175, "Gold Hairpin"],
  [176, "Ribbon"],
  [177, "Bronze Helm"],
  [178, "Iron Helm"],
  [179, "Mythril Helm"],
  [180, "Golden Helm"],
  [181, "Diamond Helm"],
  [182, "Crystal Helm"],
  [183, "Genji Helm"],
  [184, "Grand Helm"],
  [185, "Thornlet"],
  [186, "Leather Armor"],
  [187, "Angel Robe"],
  [188, "Mirage Vest"],
  [189, "Rainbow Dress"],
  [190, "Vishnu Vest"],
  [191, "Copper Cuirass"],
  [192, "Kenpo Gi"],
  [193, "Silver Plate"],
  [194, "Ninja Suit"],
  [195, "Power Sash"],
  [196, "Diamond Plate"],
  [197, "Black Garb"],
  [198, "Bone Mail"],
  [199, "Cotton Robe"],
  [200, "Silk Robe"],
  [201, "Sage's Surplice"],
  [202, "Gaia Gear"],
  [203, "Luminous Robe"],
  [204, "Black Robe"],
  [205, "White Robe"],
  [206, "Robe of Lords"],
  [207, "Bronze Armor"],
  [208, "Iron Armor"],
  [209, "Mythril Armor"],
  [210, "Golden Armor"],
  [211, "Diamond Armor"],
  [212, "Crystal Armor"],
  [213, "Genji Armor"],
  [214, "Maximillian"],
  [215, "Mythril Glove"],
  [216, "Thief's Gloves"],
  [217, "Gauntlets"],
  [218, "Titan's Gloves"],
  [219, "Genji Gloves"],
  [220, "Silver Armlet"],
  [221, "Power Armlet"],
  [222, "Diamond Armlet"],
  [223, "Hyper Wrist"],
  [224, "Leather Shoes"],
  [225, "Hermes Sandals"],
  [226, "Red Slippers"],
  [227, "Angel Ring"],
  [228, "Flame Ring"],
  [229, "Coral Ring"],
  [230, "Reflect Ring"],
  [231, "Protect Ring"],
  [232, "Cursed Ring"],
  [233, "Kaiser Knuckles"],
  [234, "Silver Specs"],
  [235, "Elven Mantle"],
  [236, "Sorceror's Mantle"],
  [237, "Chaos Orb"],
  [238, "Crystal Orb"],
  [239, "Kornago Gourd "]
]);

const MagicNames = new Map([
  [19, "Cure"],
  [20, "Libra"],
  [21, "Poisona"],
  [22, "Silence"],
  [23, "Protect"],
  [24, "Mini"],
  [25, "Cura"],
  [26, "Raise"],
  [27, "Confuse"],
  [28, "Blink"],
  [29, "Shell"],
  [30, "Esuna"],
  [31, "Curaga"],
  [32, "Reflect"],
  [33, "Berserk"],
  [34, "Arise"],
  [35, "Holy"],
  [36, "Dispel"],
  [37, "Fire"],
  [38, "Blizzard"],
  [39, "Thunder"],
  [40, "Poison"],
  [41, "Sleep"],
  [42, "Toad"],
  [43, "Fira"],
  [44, "Blizzara"],
  [45, "Thundara"],
  [46, "Drain"],
  [47, "Break"],
  [48, "Bio"],
  [49, "Firaga"],
  [50, "Blizzaga"],
  [51, "Thundaga"],
  [52, "Flare"],
  [53, "Death"],
  [54, "Osmose"],
  [55, "Speed"],
  [56, "Slow"],
  [57, "Regen"],
  [58, "Mute"],
  [59, "Haste"],
  [60, "Float"],
  [61, "Gravity"],
  [62, "Stop"],
  [63, "Teleport"],
  [64, "Comet"],
  [65, "Slowga"],
  [66, "Return"],
  [67, "Graviga"],
  [68, "Hastega"],
  [69, "Old"],
  [70, "Meteor"],
  [71, "Quick"],
  [72, "Banish"],
  [73, "Chocobo"],
  [74, "Sylph"],
  [75, "Remora"],
  [76, "Shiva"],
  [77, "Ramuh"],
  [78, "Ifrit"],
  [79, "Titan"],
  [80, "Golem"],
  [81, "Catoblepas"],
  [82, "Carbuncle"],
  [83, "Syldra"],
  [84, "Odin"],
  [85, "Phoenix"],
  [86, "Leviathan"],
  [87, "Bahamut"],
  [106, "Sinewy Etude"],
  [107, "Swift Song"],
  [108, "Mighty March"],
  [109, "Mana's Pean"],
  [110, "Hero's Rime"],
  [111, "Requiem"],
  [112, "Romeo's Ballad"],
  [113, "Alluring Air"],
  [299, "Doom"],
  [300, "Roulette"],
  [301, "Aqua Breath"],
  [302, "Level 5 Death"],
  [303, "Level 4 Graviga"],
  [304, "Level 2 Old"],
  [305, "Level 3 Flare"],
  [306, "Pond's Chorus"],
  [307, "Lilliputian Lyric"],
  [308, "Flash"],
  [309, "Time Slip"],
  [310, "Moon Flute"],
  [311, "Death Claw"],
  [312, "Aero"],
  [313, "Aera"],
  [314, "Aeroga"],
  [315, "Flame Thrower"],
  [316, "Goblin Punch"],
  [317, "Dark Spark"],
  [318, "Off-Guard"],
  [319, "Transfusion"],
  [320, "Mind Blast"],
  [321, "Vampire"],
  [322, "Magic Hammer"],
  [323, "Mighty Guard"],
  [324, "Self-Destruct"],
  [325, "???"],
  [326, "1000 Needles"],
  [327, "White Wind"],
  [328, "Missile"]
]);