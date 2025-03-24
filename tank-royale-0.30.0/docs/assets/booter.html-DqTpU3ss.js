import{_ as r,c as p,b as s,d as n,e as t,a,w as c,r as o,o as d}from"./app-GL2ZUgto.js";const u={};function h(m,e){const i=o("Mermaid"),l=o("RouteLink");return d(),p("div",null,[e[6]||(e[6]=s("h1",{id:"booter",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#booter"},[s("span",null,"Booter")])],-1)),e[7]||(e[7]=s("h2",{id:"introduction",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#introduction"},[s("span",null,"Introduction")])],-1)),e[8]||(e[8]=s("p",null,[n("A "),s("strong",null,"booter"),n(" is provided to boot up bots on a local machine.")],-1)),e[9]||(e[9]=s("p",null,"It comes built-in with the GUI for Robocode Tank Royale, but can also run as stand-alone as well, e.g. if no GUI is being used.",-1)),e[10]||(e[10]=s("p",null,"The intention of the booter is to allow booting up bots for any ecosystem and programming language. To make this possible, the booter uses script files that are responsible for starting up bots for specific programming languages and systems. Hence, the booter needs to locate these script files for each bot, and thus makes use of a filename convention to locate these.",-1)),e[11]||(e[11]=s("p",null,"Diagram showing how the booter boots up a bot:",-1)),t(i,{id:"mermaid-18",code:"eJxLy8kvT85ILCpRCHHhUgACp/z8ktQiBV1dhZz85MSSVIXEvBSFotK8YqCQnUJwclFmQYlbZk4qWDGCC9KQBNRarFBaAFbplF/ChaYmGsJUSAOyY7kAMpAmVA=="}),e[12]||(e[12]=a(`<h2 id="root-directories" tabindex="-1"><a class="header-anchor" href="#root-directories"><span>Root directories</span></a></h2><p>A bot <strong>root directory</strong> is top-level directory which is a collection of <strong>bot directories</strong>. For example, the sample bots is a collection of bot directories containing directories like:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">[root directory]</span>
<span class="line">├── Corners (a bot directory)</span>
<span class="line">├── Crazy</span>
<span class="line">├── Fire</span>
<span class="line">├── MyFirstBot</span>
<span class="line">...</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Each of the directory names listed represents a <strong>bot directory</strong>.</p><p>Multiple root directories can be supplied to the booter. This could for example be bot root directories for separate programming languages like for example Java and C#.</p><h2 id="bot-directories" tabindex="-1"><a class="header-anchor" href="#bot-directories"><span>Bot directories</span></a></h2><p>A <strong>bot directory</strong> contains all files required to run a specific bot type and perhaps some metadata like a ReadMe file etc. for the bot.</p><p>As minimum these files <em>must</em> be available in a bot directory:</p><ul><li>Script for running the bot, i.e. a <strong>sh</strong> file (macOS and Linux) or <strong>cmd</strong> (Windows) file.</li><li><a href="#json-config-file" title="JSON config file">JSON config file</a> that describes the bot, and specify which game types it was designed for.</li></ul><h3 id="base-filename" tabindex="-1"><a class="header-anchor" href="#base-filename"><span>Base filename</span></a></h3><p>All bot files inside a bot directory must share the same common base filename, which <em>must</em> match the filename of the (parent) bot directory. Otherwise, the game will not be able to locate the bot file(s) as it is looking for filenames matching the filename of the bot directory. All other files are ignored by the booter.</p><h3 id="example-of-bot-files" tabindex="-1"><a class="header-anchor" href="#example-of-bot-files"><span>Example of bot files</span></a></h3><p>Here is an example of files contained in a bot directory. In this case the Java version of MyFirstBot:</p><ul><li><code>MyFirstBot.java</code> is the Java source file containing the bot program.</li><li><code>MyFirstBot.json</code> is the JSON config file.</li><li><code>MyFirstBot.cmd</code> used for running the bot on Windows.</li><li><code>MyFirstBot.sh</code> used for running the bot on macOS and Linux.</li><li><code>ReadMe.md</code> is a ReadMe file used for instructions for how to run the bot.</li></ul><h2 id="script-files" tabindex="-1"><a class="header-anchor" href="#script-files"><span>Script files</span></a></h2><p>The booter will look for script files and look for some that match the OS it is running on. So for macOS and Linux the booter will try to locate a shell script file (.sh file) with the name <em>BotName</em>.sh and with Windows the booter will try to locate a command script file (.cmd file) with the name <em>BotName</em>.cmd.</p><p>The script should contain the necessary command for running a bot. For Java-based bots, the <code>java</code> command can be used for running a bot, and for a .Net-based bot the <code>dotnet</code> command can be used for running the bot.</p><p>The assumption here is the command(s) used within the scripts are available on the local machine running the bots. Hence, it is a good idea to provide a ReadMe file that describes the required commands that must be installed to run the script for a bot if other people should be able to run the bot on their system.</p><h2 id="json-config-file" tabindex="-1"><a class="header-anchor" href="#json-config-file"><span>JSON config file</span></a></h2><p>All bot directories must contain a <a href="https://fileinfo.com/extension/json" title="JSON (JavaScript Object Notation File)" target="_blank" rel="noopener noreferrer">JSON</a> file, which is basically a description of the bot (or team).</p><p>For example, the bot MyFirstBot is accompanied by a <strong>MyFirstBot.json</strong> file.</p><p>MyFirstBot.json for .Net:</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre class="language-json"><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line highlighted">  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;My First Bot&quot;</span><span class="token punctuation">,</span></span>
<span class="line highlighted">  <span class="token property">&quot;version&quot;</span><span class="token operator">:</span> <span class="token string">&quot;1.0&quot;</span><span class="token punctuation">,</span></span>
<span class="line highlighted">  <span class="token property">&quot;authors&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line highlighted">    <span class="token string">&quot;Mathew Nelson&quot;</span><span class="token punctuation">,</span></span>
<span class="line highlighted">    <span class="token string">&quot;Flemming N. Larsen&quot;</span></span>
<span class="line highlighted">  <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> <span class="token string">&quot;A sample bot that is probably the first bot you will learn about.&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;homepage&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;countryCodes&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token string">&quot;us&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">&quot;dk&quot;</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;platform&quot;</span><span class="token operator">:</span> <span class="token string">&quot;.Net 6.0&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;programmingLang&quot;</span><span class="token operator">:</span> <span class="token string">&quot;C# 10.0&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;initialPosition&quot;</span><span class="token operator">:</span> <span class="token string">&quot;50,50, 90&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>These fields are required:</p><ul><li>name</li><li>version</li><li>authors</li></ul><p>The remaining fields are all optional, but recommended.</p><p>Meaning of each field in the JSON file:</p>`,27)),s("ul",null,[e[4]||(e[4]=a('<li><code>name</code>: is the display name of the bot.</li><li><code>version</code>: is the version of the bot, where <a href="https://semver.org/" title="Semantic Versioning 2.0.0" target="_blank" rel="noopener noreferrer">SEMVER</a> is the recommended format, but not a requirement.</li><li><code>authors</code>: is a list containing the (full) name of the bot author(s). The name could be a nickname or handle.</li><li><code>description</code>: is a brief description of the bot.</li><li><code>homepage</code>: is a link to a web page for the bot.</li><li><code>countryCodes</code>: is a list containing <a href="https://www.iban.com/country-codes" title="Alpha-2 country codes" target="_blank" rel="noopener noreferrer">Alpha-2</a> country codes, representing the country of each author and/or bot.</li><li><code>platform</code>: is the platform required for running the bot, e.g. Java 17 or .Net 6.0.</li><li><code>programmingLang</code>: is the programming language used for programming the bot, e.g. C# or Kotlin.</li>',8)),s("li",null,[e[1]||(e[1]=s("code",null,"gameTypes",-1)),e[2]||(e[2]=n(": is a comma-separated list containing the ")),t(l,{to:"/articles/game_types.html"},{default:c(()=>e[0]||(e[0]=[n("game types")])),_:1}),e[3]||(e[3]=n(" that the bot is supporting, meaning that it should not play in battles with game types other than the listed ones. When this field is omitted, the bot will participate in any type of game."))]),e[5]||(e[5]=s("li",null,[s("code",null,"initialPosition"),n(": is a comma-separated string containing the starting x and y coordinate, and direction (body, gun, and radar) when the game begins in the format: x, y, direction. [^initial-start-position]")],-1))]),e[13]||(e[13]=a(`<p>Note that <code>initialPosition</code> should only be used for debugging purposes where using the same starting position and direction of the body, gun, and radar is convenient. You need to enable initial starting position using the <code>--enable-initial-position</code> option with the <a href="https://github.com/robocode-dev/tank-royale/tree/master/server#readme" title="Server" target="_blank" rel="noopener noreferrer">server</a>.</p><h3 id="escaping-special-characters" tabindex="-1"><a class="header-anchor" href="#escaping-special-characters"><span>Escaping special characters</span></a></h3><p>Note that some characters are reserved in <a href="https://fileinfo.com/extension/json" title="JSON (JavaScript Object Notation File)" target="_blank" rel="noopener noreferrer">JSON</a> and <em>must</em> be escaped within the JSON strings. Otherwise, the config file for the bot cannot be read properly, and the bot might not boot.</p><ul><li><strong>Double quote</strong> is replaced with <code>\\&quot;</code></li><li><strong>Backslash</strong> to be replaced with <code>\\\\</code></li><li><strong>Newline</strong> is replaced with <code>\\n</code></li><li><strong>Carriage return</strong> is replaced with <code>\\r</code></li><li><strong>Tab</strong> is replaced with <code>\\t</code></li><li><strong>Form feed</strong> is replaced with <code>\\f</code></li><li><strong>Backspace</strong> is replaced with <code>\\b</code></li></ul><h2 id="team-directories" tabindex="-1"><a class="header-anchor" href="#team-directories"><span>Team directories</span></a></h2><p>With Robocode, bots can be grouped together into teams. Teams are defined in a similar way as bots. Teams use directories as well, where the name of the team directory is the same as team name, e.g., MyFirstTeam. And a JSON file is needed to define the team.</p><p>MyFirstTeam.json:</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre class="language-json"><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;MyFirstTeam&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;version&quot;</span><span class="token operator">:</span> <span class="token string">&quot;1.0&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;authors&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token string">&quot;Mathew Nelson&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">&quot;Flemming N. Larsen&quot;</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> <span class="token string">&quot;A sample team.\\nMyFirstLeader scans for enemies,\\nand orders the droids to fire.&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;homepage&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;countryCodes&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token string">&quot;us&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">&quot;dk&quot;</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line highlighted">  <span class="token property">&quot;teamMembers&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line highlighted">    <span class="token string">&quot;MyFirstLeader&quot;</span><span class="token punctuation">,</span></span>
<span class="line highlighted">    <span class="token string">&quot;MyFirstDroid&quot;</span><span class="token punctuation">,</span></span>
<span class="line highlighted">    <span class="token string">&quot;MyFirstDroid&quot;</span><span class="token punctuation">,</span></span>
<span class="line highlighted">    <span class="token string">&quot;MyFirstDroid&quot;</span><span class="token punctuation">,</span></span>
<span class="line highlighted">    <span class="token string">&quot;MyFirstDroid&quot;</span></span>
<span class="line highlighted">  <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Notice the <code>teamMembers</code> field, which contains the name of each member bot. Each member must reside in a bot directory next to the team directory so that the booter is able to locate the bots.</p><p>With the MyFirstTeam, the first listed member is MyFirstLeader, and then we have 4 more bots named MyFirstDroid. This means that the team contains 5 members in total.</p><p>Note that most fields are the same as used for defining bots. But these fields are not used for teams:</p><ul><li><code>countryCodes</code></li><li><code>platform</code></li><li><code>programmingLang</code></li><li><code>gameTypes</code></li><li><code>initialPosition</code></li></ul><p>Also note that only the JSON file is needed for defining the team.</p>`,13))])}const b=r(u,[["render",h],["__file","booter.html.vue"]]),f=JSON.parse('{"path":"/articles/booter.html","title":"Booter","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"Introduction","slug":"introduction","link":"#introduction","children":[]},{"level":2,"title":"Root directories","slug":"root-directories","link":"#root-directories","children":[]},{"level":2,"title":"Bot directories","slug":"bot-directories","link":"#bot-directories","children":[{"level":3,"title":"Base filename","slug":"base-filename","link":"#base-filename","children":[]},{"level":3,"title":"Example of bot files","slug":"example-of-bot-files","link":"#example-of-bot-files","children":[]}]},{"level":2,"title":"Script files","slug":"script-files","link":"#script-files","children":[]},{"level":2,"title":"JSON config file","slug":"json-config-file","link":"#json-config-file","children":[{"level":3,"title":"Escaping special characters","slug":"escaping-special-characters","link":"#escaping-special-characters","children":[]}]},{"level":2,"title":"Team directories","slug":"team-directories","link":"#team-directories","children":[]}],"git":{"updatedTime":1692563446000},"filePathRelative":"articles/booter.md"}');export{b as comp,f as data};
