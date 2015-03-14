var Theme = (function()
{
	var defaultTheme = "monokai",
		loadedThemes = [];

	function Load(theme)
	{
		theme = theme.indexOf('solarized') != -1 ? 'solarized' : theme;
		if(loadedThemes.indexOf(theme) == -1)
		{
			var link = document.createElement("link");
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("type", "text/css");
			link.setAttribute("href", "CodeMirror/theme/"+theme+".css");
			document.getElementsByTagName("head")[0].appendChild(link);
			
			loadedThemes.push(theme);
		}
	}
	
	Load(defaultTheme);
	
	return {
		defaultTheme: defaultTheme,
		Load: Load
	};
})();


function Slides(slides, opts)
{
	var currentIndex = -1; // 1-based index

	if(!opts.editor || !opts.$title || !opts.$content)
	{
		throw new Error("Missing parameter to Slides constructor");
	}

	this.previousSlide = function()
	{
		if(currentIndex > 1)
		{
			currentIndex--;
			showSlide();
		}
	};

	this.nextSlide = function()
	{
		if(currentIndex < slides.length)
		{
			currentIndex++;
			showSlide();
		}
	};

	this.gotoSlide = function(index)
	{
		if(currentIndex != index)
		{
			currentIndex = index;
			showSlide();
		}
	};

	function showSlide()
	{
		var $slide = $(slides[currentIndex - 1]),
			title = $slide.find("div.title").text(),
			content = $slide.find("div.content").html(),
			code = $slide.find("pre").text();

		var $wrapper = $(opts.editor.getWrapperElement());
		if(code.length === 0)
		{
			$wrapper.hide();
		}
		else
		{
			$wrapper.show();
		}

		opts.$title.text(title);
		opts.$content.html(content);
		opts.editor.setValue(code);

		// Buttons
		if(opts.$previous && opts.$next)
		{
			currentIndex == 1 ? opts.$previous.hide() : opts.$previous.show();
			currentIndex == slides.length ? opts.$next.hide() : opts.$next.show();
		}

		location.hash = '#' + currentIndex;
		opts.$position.text(currentIndex + '/' + slides.length);
	};

	if(opts.$previous && opts.$next)
	{
		var that = this;
		opts.$previous.click(function()
		{
			that.previousSlide();
		});
		opts.$next.click(function()
		{
			that.nextSlide();
		});
	}
};

$(document).ready(function()
{
	var editor = CodeMirror.fromTextArea($('#code')[0],
	{
		mode: "javascript",
		theme: Theme.defaultTheme,
		lineNumbers: true,
		lineWrapping: true,
		readOnly: true,

		// Addons
		matchBrackets: true,
		styleActiveLine: true
	});

	$('#themeSelector').change(function()
	{
		var select = this,
			theme = select.options[select.selectedIndex].text;
		Theme.Load(theme);
		editor.setOption("theme", theme);
	});

	//------------------------------
	// Slides

	var diapo = new Slides($('section'),
	{
		editor: editor,
		$title: $('#title'),
		$content: $('#content'),
		$previous: $('#previous'),
		$next: $('#next'),
		$position: $('#position')
	});

	var slideIndex = 1;
	function GetHashSlide()
	{
		return Number(location.hash.substr(1));
	}
	if(location.hash)
	{
		slideIndex = GetHashSlide();
	}
	diapo.gotoSlide(slideIndex);

	$(window).on('hashchange', function()
	{
		var num = GetHashSlide();
		diapo.gotoSlide(num);
	});

	$(document).keydown(function(evt)
	{
		switch(evt.which)
		{
			case 37:
				diapo.previousSlide();
				break;
			case 39:
				diapo.nextSlide();
				break;
			default:
				break;
		}
	});
});