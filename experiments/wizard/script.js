
// This is a crappy DEMO ; Do not use in production

var animating; //flag to prevent quick multi-click glitches
var current_fs; // current slide

$(".next").click(function()
{
	if (animating)
	{
		return false;
	}

	current_fs = $(this).parent();
	var next_fs = current_fs.next();

	var index = $("fieldset").index(next_fs);
	if (!OnSlideChange.call(current_fs, index - 1, false))
	{
		return false;
	}

	animating = true;
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq(index).addClass("active");

	//show the next fieldset
	next_fs.show();
	//hide the current fieldset with style
	current_fs.animate(
	{
		opacity: 0
	},
	{
		step: function (now)
		{
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			var scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			var left = (now * 50) + "%";
			//3. increase opacity of next_fs to 1 as it moves in
			var opacity = 1 - now;
			current_fs.css(
			{
				'transform': 'scale(' + scale + ')'
			});
			next_fs.css(
			{
				'left': left,
				'opacity': opacity
			});
		},
		duration: 800,
		complete: function ()
		{
			current_fs.hide();
			current_fs = next_fs;
			animating = false;
			OnSlideLoaded.call(current_fs, index);
		},
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".previous").click(function ()
{
	if (animating)
	{
		return false;
	}
	animating = true;

	current_fs = $(this).parent();
	var previous_fs = current_fs.prev();

	var index = $("fieldset").index(current_fs);
	if (!OnSlideChange.call(current_fs, index, false))
	{
		return false;
	}

	//de-activate current step on progressbar
	$("#progressbar li").eq(index).removeClass("active");

	//show the previous fieldset
	previous_fs.show();
	//hide the current fieldset with style
	current_fs.animate(
	{
		opacity: 0
	},
	{
		step: function (now)
		{
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			var scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			var left = ((1 - now) * 50) + "%";
			//3. increase opacity of previous_fs to 1 as it moves in
			var opacity = 1 - now;
			current_fs.css(
			{
				'left': left
			});
			previous_fs.css(
			{
				'transform': 'scale(' + scale + ')',
				'opacity': opacity
			});
		},
		duration: 800,
		complete: function ()
		{
			current_fs.hide();
			current_fs = previous_fs;
			animating = false;
			OnSlideLoaded.call(current_fs, index - 1);
		},
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

// Setup progress bar items width
var $steps = $("#progressbar li");
$steps.width(100 / $steps.length + "%");

// First slide
OnSlideLoaded.call($("fieldset:first"), 0);

$(window).keydown(function (e)
{
	if (e.which == 8) // Trap backspace
	{
		current_fs.find("input.previous").click();
		return false;
	}
});

// Disable form submission
$("input[type=submit]").click(function ()
{
	alert("OK!");
	return false;
});

// Fancy mouseover
$("table.products tr").hover(
	function ()
	{
		$(this).css("background-color","yellow");
	}, 
	function ()
	{
		$(this).css("background-color","");
	}
);

// Before changing the slide (validations)
// index is 0-based
// back is true if from right
function OnSlideChange (index, back)
{
	if (back)
	{
		return true;
	}

	if (index == 0)
	{
		var $search = this.find("input[name=search]");
		$search.focus();
		if ($search.val().length === 0)
		{
			this.find(".err1").slideToggle().delay(3000).slideToggle();
			return false;
		}
	}
	else if (index == 1)
	{
		var fs = this;
		setTimeout(function ()
		{
			var $results = fs.find(".results"),
				$subtitle = fs.find("h3.fs-subtitle"),
				$img = fs.find("img.loading"),
				$next = fs.find("input.next");
			$img.show();
			$next.hide();
			$subtitle.text("Recherche en cours...");
			$results.hide();
		}, 1000);
	}

	return true;
}

// After a slide is displayed
// index is 0-based
function OnSlideLoaded (index)
{
	var fs = this;
	if (index == 0)
	{
		var $search = this.find("input[name=search]");
		$search
			.focus()
			.keypress(function (e)
			{
				if (e.which == 13) // Enter
				{
					fs.find("input.next").click();
				}
			});
	}
	else if (index == 1)
	{
		setTimeout(function ()
		{
			var $results = fs.find(".results"),
				$subtitle = fs.find("h3.fs-subtitle"),
				$img = fs.find("img.loading"),
				$next = fs.find("input.next");

			$img.hide();
			$next.show();
			$subtitle.text("Voici les résultats trouvés");
			$results.slideDown();
		}, 1000);
	}
}
