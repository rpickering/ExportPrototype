##ExportPrototype.jsx
===============

###About

This Adobe Illustrator script is intended as a tool for interaction designers creating high-fidelity prototypes in code. By generating some super basic HTML, CSS and PNGs from Illustrator layers, the script cuts the time it takes from a layout to the foundation of an interactive prototype. Just add jQuery!

###To install

• Move ExportPrototype.jsx to Applications > Adobe Illustrator CS6 > Presets > en_GB > Scripts
• Restart Illustrator

###To use

• Make sure your AI file is saved into it's own folder, to keep things tidy
• Create as many layers as you need individual divs, and name them appropriately. The layer’s name becomes the class for each div.
• Save your file first, then go to File > Scripts > ExportPrototype
• The script will spit out files into the folder containing the current file - you can now open these in your favourite code editor and get prototyping!

###Notes, support and known issues

This script has so far been tested in Adobe Illustrator CS6 (mac) only. There is a known issue caused by Adobe’s quite unpredictable coordinates system, where occasionally elements will be positioned incorrectly. Best advice is to find the offending layer and remove it, or to start a canvas from scratch, adding layers individually. I hope to find a fix for this soon.

The script currently does not cater for the following (but hopefully will in due course):

• Nested divs
• Spaces in layer names
• Custom IDs from layer names 
• Retina images
• A persistent ‘plugin’ UI
• Further export options

###Get in touch!

I’m keen to improve this based on real-life use cases - perhaps you’d prefer it to generate IDs by default rather than classes, or perhaps you want the option to output ‘real’ text… If you have a different style of working and something could fit your needs better, please get in touch. 
