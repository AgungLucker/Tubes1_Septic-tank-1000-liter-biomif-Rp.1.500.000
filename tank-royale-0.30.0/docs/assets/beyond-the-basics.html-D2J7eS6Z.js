import{_ as e,c as t,o as n,b as o}from"./app-uiI3RID_.js";const a={},i=o(`<h1 id="beyond-the-basics" tabindex="-1"><a class="header-anchor" href="#beyond-the-basics"><span>Beyond the Basics</span></a></h1><p>At this point, you should already have read the <a href="../articles/intro" title="Introduction">Introduction</a>, <a href="../tutorial/getting-started" title="Getting Started tutorial">Getting Started</a>, and the <a href="../tutorial/my-first-bot" title="My First Bot tutorial">My First Bot</a> tutorial, and now you want to progress and learn more about Robocode beyond the basics.</p><p>In the following, it is assumed that you are already familiar with and use the official <a href="../api/apis" title="Bot APIs">Bot APIs</a>. This tutorial is taking offset in the official Bot APIs. Also notice, that the class and method names take offset in the Java API, but should be similar in APIs for other platforms.</p><h2 id="the-robowiki" tabindex="-1"><a class="header-anchor" href="#the-robowiki"><span>The RoboWiki</span></a></h2><p>The <a href="https://robowiki.net/wiki/Main_Page" title="RoboWiki. Collecting Robocode knowledge since 2003" target="_blank" rel="noopener noreferrer">RoboWiki</a> is the best place to gain the most knowledge about Robocode. This site has been collecting lots of great expertise from Robocoders since 2003. On the RoboWiki you can benefit from learning a lot of different strategies for movement, targeting, efficient radar sweeps, etc. You can also get some pretty good hints with for example using various kinds of AIs.</p><p>Note that the <a href="https://robowiki.net/wiki/Main_Page" title="RoboWiki. Collecting Robocode knowledge since 2003" target="_blank" rel="noopener noreferrer">RoboWiki</a> is primarily targeted at the <a href="https://robocode.sourceforge.io/" title="Home of the original version of Robocode" target="_blank" rel="noopener noreferrer">original version</a> of Robocode, so you should expect differences between the original version and the new version (Robocode Tank Royale). For example, the API is a bit different, and the original version of Robocode did not use a booter or a server and was mostly based on the Java language only. You can read about some important differences <a href="../articles/tank-royale">here</a>. Nevertheless, the various strategies you would apply for Robocoding with the original version of Robocode should be easy to apply for the new version as well. And even when most code snippets are written for Java, it should be straightforward to port to a similar programming language e.g. C# or Typescript.</p><p>Also note that the RoboWiki is driven by Robocoders, not by the author(s) of Robocode. So if the site is down, which happens sometimes, you can (and should) report this on e.g. the <a href="https://groups.google.com/g/robocode" title="Google Group for Robocode" target="_blank" rel="noopener noreferrer">Google Group</a> for Robocode. Then action will be taken to get it up and running as soon as possible.</p><p>If the <a href="https://robowiki.net/wiki/Main_Page" title="RoboWiki. Collecting Robocode knowledge since 2003" target="_blank" rel="noopener noreferrer">RoboWiki</a> is down, you can use the <a href="https://web.archive.org/web/20240514014223/https://robowiki.net/wiki/Main_Page" title="Web Archive for the RoboWiki" target="_blank" rel="noopener noreferrer">Web Archive</a> temporarily until the RoboWiki site is up and running again. But note that the link points to a snapshot of the site, and might be a bit outdated.</p><h2 id="event-queue" tabindex="-1"><a class="header-anchor" href="#event-queue"><span>Event Queue</span></a></h2><p>An essential part of Robocoding is event handling. Hence, this is explained in more detail in the following along with some advice.</p><p>All events received from the game server are immediately stored in an event queue. The events in the event queue will first and foremost be ordered by the <em>turn number</em>, and secondly events that belong to the same turn are ordered by their <em>event priority</em>. Events with higher priorities are handled before events with lower priorities.</p><blockquote><p>Note that all events have a predefined event priority, but you can change this with the API if you want to change the ordering of the events.</p></blockquote><p>Note that you should expect multiple events to occur within the same turn and more events of the same type, e.g. <code>ScannedRobotEvent</code> occurring in the same turn when more bots have been scanned.</p><p>Events are dispatched from the event queue one event at a time. Each calls a synchronous blocking method call via a single dedicated event thread. When an event is dispatched its corresponding event handler method is being called. When e.g. a <code>ScannedBotEvent</code> is triggered, the corresponding <code>onScannedBotEvent(ScannedBotEvent)</code> method will be called, blocking the event thread, until it has finished executing.</p><p>Notice that the event queue will stack up events until they have been handled by calling event handlers or till the events are getting &quot;too old&quot;. When an event has been queued up for more than 2 turns, it is considered outdated and will be removed from the event queue automatically. The only exception is events that have been defined as <em>critical</em>. Those events will only be removed when these have been handled regardless of how old they are.</p><p>Examples of critical events are the <code>DeathEvent</code>, <code>SkippedTurnEvent</code>, and <code>WonRoundEvent</code>.</p><h2 id="event-handlers" tabindex="-1"><a class="header-anchor" href="#event-handlers"><span>Event handlers</span></a></h2><p>Event handlers are predefined methods prefixed with <code>on</code>, e.g. the <code>onScannedBot</code>. To take action when an event happens, you need to implement/override the predefined method for the event handler, i.e. override the <code>onScannedBot</code> method, so you can take action when an enemy bot has been scanned to target the bot.</p><p>When handling an event, e.g. when a bot has been scanned with the <code>ScannedRobotEvent</code> in the <code>onScannedRobot()</code> event handler, make sure to:</p><ol><li>Keep the code at a minimum</li><li>Avoid calling API methods!</li><li>Avoid calling I/O methods!</li><li>Gather intelligence information only</li></ol><h3 id="keep-the-code-at-a-minimum" tabindex="-1"><a class="header-anchor" href="#keep-the-code-at-a-minimum"><span>Keep the code at a minimum</span></a></h3><p>Avoid CPU-consuming logic in your event handlers. The reason is that the event handler is a <code>blocking call</code>. Hence, no other event handlers can execute before the current event handler has been executed.</p><p>And if a method takes too long to process, the current turn, and perhaps several turns will have passed since it was invoked, meaning it will not be possible to react fast enough on an event for the current turn.</p><h3 id="avoid-calling-api-methods" tabindex="-1"><a class="header-anchor" href="#avoid-calling-api-methods"><span>Avoid calling API methods!</span></a></h3><p>It is considered bad practice to call Bot API methods from the event handlers. If you call e.g. the <code>fire()</code> method, the event handler will be blocked until the gun has fired, meaning that other event handlers will be triggered at a later turn, and might get too old on the event queue, and hence removed. This way the bot will not be able to cope with other events and might lack crucial information for the logic to work properly and efficiently.</p><h3 id="avoid-calling-i-o-methods" tabindex="-1"><a class="header-anchor" href="#avoid-calling-i-o-methods"><span>Avoid calling I/O methods!</span></a></h3><p>For the same reasons as with calling Bot API methods, it is considered bad practice to call I/O intensive methods as the event handler might block for one or several turns.</p><p>A better alternative may be to use a thread that runs beside the event handlers or use the logic in the <code>run()</code> method to make the I/O calls if possible.</p><p>If for example, you need to log data, you might want to use a synchronous logger or put each log entry into some logging-specific data structure, and save all log entries at once when the round or battle has ended, which could be achieved by using the <code>onRoundEnded()</code> or <code>onGameEnded()</code> methods respectively.</p><h3 id="gather-intelligence-information-only" tabindex="-1"><a class="header-anchor" href="#gather-intelligence-information-only"><span>Gather intelligence information only</span></a></h3><p>The event handlers are only required to gain up-to-date information about your bot&#39;s information. Consider your event handlers as &quot;sensors&quot; of your bot. And you should do your best to make the most out of the information you gain from the event handlers.</p><p>There is no need to keep track of event data if your bot does not need to take action for a specific type of event (obviously). However, with some events, it is crucial to keep track of the event data.</p><p>With a minimal event handler, you only need to store the event data in some data structure, and nothing more. That is, to gain information about the bot&#39;s surroundings. The gathered data will then be used later when the bot must decide on proper actions.</p><blockquote><p>As mentioned earlier, it is a bad idea to take immediate action within an event handler. More on that later!</p></blockquote><p>One example is when an enemy bot has been spotted triggering the <code>onScannedBot()</code> method. Here it makes sense to store e.g. the position and orientation of enemy bots scanned on specific turns. For example, you could create a history of the recent positions for each robot. This way, you might be able to predict the position of an enemy but some turns ahead.</p><p>The ability to predict the future position of an enemy bot is crucial for aiming the turret in the direction of this target position to hit the bot.</p><h2 id="overall-bot-behavior" tabindex="-1"><a class="header-anchor" href="#overall-bot-behavior"><span>Overall Bot Behavior</span></a></h2><p>A lot has been said about event handling in this tutorial. And you have been advised to avoid taking immediate actions with the event handlers. Why so, you might rightfully ask?</p><p>With primitive bots, in particular small bots used for demoing e.g. the sample bots, a simple targeting strategy would be to just shoot directly at the point where an enemy is currently located, and also move around more or less randomly. This might seem good for a start, but in the long run, more advanced bots will outperform simple bots due to better intelligence.</p><p>Here are a few examples of what advanced robots can do:</p><ul><li>Make efficient use of the scanner.</li><li>Pick out the best target enemy among the enemy bots left on the battlefield to fire at.</li><li>Predict the future position of a target bot taking the bullet&#39;s travel time into account to hit the target.</li><li>Balance how much energy to use when firing a bullet depending on various situations.</li><li>Decide on the best movement for moving the robot around depending on the situation.</li></ul><p>All of the above requires a structured approach and &quot;centralizing&quot; the code into one place that is guaranteed to always run in each turn, and not rely on bits and pieces of code being run one or multiple times in a turn within event handlers that might or might not be triggered in a turn.</p><p>So you should set up a central place in your bot that takes action based on the (new) data it gets from its &quot;sensors&quot;, i.e. the events. The <code>run()</code> method of the bot is an excellent place to put this logic. Alternatively, you could start one to multiple threads for handling e.g. movement, scanning, targeting, etc.</p><h2 id="strategies" tabindex="-1"><a class="header-anchor" href="#strategies"><span>Strategies</span></a></h2><p>With Robocode, successful bots use multiple strategies. Some bots are specialized for 1-versus-1 battle, where only 2 bots participate, and hence only have a single enemy to worry about. This makes things less complicated compared to e.g. a bot participating in a melee battle against 10 different enemy bots. And if the bot is a bot in a team, a team strategy should be applied as well. So you need to consider, which types of battles your bot is developed for.</p><blockquote><p>Note that you can specify the game types your bot can handle, e.g. classic, 1v1, and melee.</p></blockquote><h3 id="strategy-types" tabindex="-1"><a class="header-anchor" href="#strategy-types"><span>Strategy types</span></a></h3><p>A very efficient mindset to have when Robocoding is to divide the strategies into categories fitting the various parts of the tank:</p><ol><li><strong>Movement strategy</strong>: The <em>body</em> is responsible for movement and getting the bot to a good position on the battlefield and avoid being hit by bullets.</li><li><strong>Gun strategy</strong>: <ol><li>The <em>turret</em> is responsible for turning the cannon in the right direction of the target.</li><li>The <em>cannon</em> is responsible for firing the bullets with the right amount of energy and speed to hit the target, and also times when to fire, and when the cannon is not heated.</li></ol></li><li><strong>Scanning strategy</strong>: The <em>radar</em> is responsible for scanning all enemies as efficiently as possible, and getting as up-to-date information about the enemies as possible.</li></ol><p>So you should have at least 3 strategies to cover these categories. And notice, that you may have multiple strategies to use for each category.</p><p>You might also have strategies, that are independent of the 3 strategies above, e.g. a strategy for picking out the next enemy target. For example, it is far easier to hit bots that move very slowly, and perhaps are not moving at all, if they have been disabled, making them an easy target. Such a strategy could work independently of the <strong>Gun strategy</strong>.</p><h3 id="divide-and-conquer" tabindex="-1"><a class="header-anchor" href="#divide-and-conquer"><span>Divide and Conquer</span></a></h3><p>One important note is that executing code for different strategies should not depend on the code execution used in other ones. For example, a movement strategy should be able to run independently of a scanning, gun strategy. Hence, using strategies is a good way to <em>divide and conquer</em> different aspects of the bot&#39;s behavior instead of mixing it all, making it easier to concentrate on one aspect at a time.</p><h3 id="multiple-strategies" tabindex="-1"><a class="header-anchor" href="#multiple-strategies"><span>Multiple strategies</span></a></h3><h4 id="scanning-strategies" tabindex="-1"><a class="header-anchor" href="#scanning-strategies"><span>Scanning strategies</span></a></h4><p>If there is only one enemy left on the battlefield, a simple radar/scanning strategy would be to point the radar in the direct direction of the enemy bot. But if there are a few enemies, you might choose to sweep the radar continuously left and right in a scanning arc that is as small as possible to receive as accurate information about the enemy positions as possible. If there are 10 or more bots on the battlefield, turning the radar left infinitely to scan all enemies in 360 degrees at all times might turn out to be an efficient strategy in that situation.</p><h3 id="gun-strategies" tabindex="-1"><a class="header-anchor" href="#gun-strategies"><span>Gun strategies</span></a></h3><p>It might also make sense to have different Gun strategies that depend on how an enemy moves. This could for example be a gun that can do simple linear targeting, circle targeting, but also more targeting for more advanced movement. So the important part is to figure out which movement pattern an enemy is using to figure out how to hit the target.</p><p>Note that you need to target &quot;ahead&quot; of its current position to a future position where you think the bot will be when the bullet should hit the target. This is because it takes time for the bullet to travel towards the target. And the heavier the bullet, the slower the bullet will move.</p><h4 id="virtual-bullets" tabindex="-1"><a class="header-anchor" href="#virtual-bullets"><span>Virtual bullets</span></a></h4><p>A common strategy used for picking the best gun strategy for a given bot is to make use of <em>virtual bullets</em>. The idea is to simulate if a bullet would have hit its target if you used one or the other gun strategy. That is without firing the gun, but just simulate that the bullet was actually fired from the gun, and then keep track of the bullet and check if it would have hit its target. The more hits you have with the &quot;virtual gun&quot;, the better that strategy is for the particular target. You might also benefit from using different strategies between various bots, e.g. to hit bots that each move differently.</p><h3 id="movement-strategies" tabindex="-1"><a class="header-anchor" href="#movement-strategies"><span>Movement strategies</span></a></h3><p>Movement can be difficult to master in Robocode. But first and foremost you should make sure your bot is not standing still as it will be an easy target. The same is the case if it moves slowly or in a very predictable pattern. If there are many bots on the battlefield, it might be wise to move into an area on the battlefield that or not too crowded.</p><p>If there are a few enemies on the battlefield, a movement strategy could be to keep a certain distance to the target enemy, and e.g. move perpendicular to the target enemy by continuously moving forward and back some distance and due small turn adjustments to keep the pointing bot in a direction 90 degrees towards the target.</p><p>Another topic is the distance to the current target. If the distance is too big, it will be more difficult to hit the target due to the bullet travel time, where the target has more time to move away. And if your bot is too close to the target, it might be better at hitting your bot taking more damage. So one challenge is to find the sweet spot.</p><h4 id="bullet-dodging" tabindex="-1"><a class="header-anchor" href="#bullet-dodging"><span>Bullet dodging</span></a></h4><p>In Robocode, your bot receives no event about enemies firing bullets. It sure would be nice to receive information about which bullets enemies have fired, e.g. the position, direction, and speed. This information would be useful to avoid getting hit by enemy bullets, i.e. <em>bullet dodging</em>.</p><p>However, you receive some event data from your enemies that can give you an idea if an enemy bot might be firing a bullet. Whenever an enemy bot is scanned, you receive information about how much energy it has. If you keep the radar laser-focused on the enemy, you should be able to detect it as soon as there is an energy drop. This could mean that the enemy took damage from a wall, a bot collision, or a bullet hit. But it could also be due to spending energy on firing a bullet.</p><p>So the first challenge is to figure out if the enemy seems to fire a bullet or not. And if so, if the bullet is fired in your direction. If there is only one bot left on the battlefield, the enemy will most likely be firing in your bot&#39;s direction. When multiple enemies are left, it is more difficult to predict, but it would be safe to assume that it fired against your bot, i.e. take no chances.</p><p>One tactic would be to keep track of potential bullets hitting you similar to <a href="#virtual-bullets">virtual bullets</a> fired from your bot. For example, you could figure out the potential target directions of the bullet, and calculate the speed of the bullet based on the energy spent on firing it. Then calculate the new positions of the virtual bullet for each new turn until the bullet is leaving the battlefield. This way, you should of course move your bots away from where the tracked virtual bullets might be to avoid getting hit.</p><h2 id="centralized-logic" tabindex="-1"><a class="header-anchor" href="#centralized-logic"><span>Centralized logic</span></a></h2><h3 id="the-run-method" tabindex="-1"><a class="header-anchor" href="#the-run-method"><span>The run method</span></a></h3><p>As mentioned earlier, it is wise to centralize the logic that performs various calculations and makes decisions but also takes action at the end of the current turn. An excellent place to do this is with the <code>run()</code> method, which is invoked for each new round.</p><h3 id="main-loop" tabindex="-1"><a class="header-anchor" href="#main-loop"><span>Main Loop</span></a></h3><p>As the <code>run()</code> method is executed once, you need to keep the method running, i.e. <em>blocking</em>. Otherwise, the method will exit as any other method, and you will not be able to use the <code>run()</code> method for any good afterward.</p><p>The best way to keep the <code>run()</code> method <em>running</em> is to make sure of this loop:</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// Initial code can be run here running each round</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token function">isRunning</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// Code running throughout the entire round</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// Final code can be run here when the bot is not running anymore</span></span>
<span class="line">    <span class="token comment">// when the round has ended.</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>⚠ Do <em>not</em> use an infinite loop like it was the case with many bots with the original Robocode. You risk that your <code>run()</code> method will keep running in the background, while a new round is started, and the <code>run()</code> method is called yet another time. This way, you risk that multiple <code>run()</code> methods run in parallel causing a <a href="https://en.wikipedia.org/wiki/Race_condition#In_software" title="Race condition in software" target="_blank" rel="noopener noreferrer">race condition</a> and will ruin your control over what happens in the bot.</p></blockquote><p>The while-loop is called the <em>main loop</em> of your bot, and here you should put the logic that needs to be run each turn.</p><p>Here is some pseudo code of how the main loop could look like:</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">initializeRound</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Initial method for initializing data structures etc.</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// Loop for each round</span></span>
<span class="line">    <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token function">isRunning</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">pickTargetEnemy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Picks a (new) target enemy</span></span>
<span class="line"></span>
<span class="line">        <span class="token function">handleMovement</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Moves the tank to a new position</span></span>
<span class="line">        <span class="token function">handleGun</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>      <span class="token comment">// Aims and fires against the current target</span></span>
<span class="line">        <span class="token function">handleRadar</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    <span class="token comment">// Turns the radar to scan enemies</span></span>
<span class="line"></span>
<span class="line">        <span class="token function">go</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Send actions to the server and hereby end the current turn</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token function">finalizeRound</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Method called when the round is over, e.g. saving data</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Here it will be up to you to implement the various methods. Each method should call commands in the API for moving the bot by calling e.g. <code>setForward()</code>, <code>setTurnLeft()</code>, etc.</p><h3 id="use-setter-methods" tabindex="-1"><a class="header-anchor" href="#use-setter-methods"><span>Use setter methods!</span></a></h3><p>Note that you should use <em>setter</em> methods like <code>setForward()</code> and <code>setFire()</code>, and not the corresponding <code>forward()</code> and <code>fire()</code> methods. The reason is that the <code>forward()</code> and <code>fire()</code> methods are blocking methods and automatically invoke the <code>go()</code> method, which will send the actions to the server and wait for the next turn. And you need to be in control and only call the <code>go()</code> as the last thing in your main loop to conclude your actions.</p><p>Another benefit of using the setter methods is that you can call the same setter method multiple times during the current turn to override the recent setter. For example, you might have called <code>setForward(50)</code> in one place, but choose to override this by calling <code>setBack(20)</code> or <code>setForward(-20)</code> (these calls are equal) with some code having higher precedence (e.g. for bullet dodging).</p><h2 id="final-words" tabindex="-1"><a class="header-anchor" href="#final-words"><span>Final words</span></a></h2><p>This concludes this tutorial. There is much more to learn about Robocoding, and we have just been scratching the surface.</p><h3 id="study-the-robowiki" tabindex="-1"><a class="header-anchor" href="#study-the-robowiki"><span>Study the RoboWiki!</span></a></h3><p>Your first challenge should be to beat the sample bots that come with Robocode. And I highly recommend you to continue to study the <a href="https://robowiki.net/wiki/Main_Page" title="RoboWiki. Collecting Robocode knowledge since 2003" target="_blank" rel="noopener noreferrer">RoboWiki</a> to get tips and tricks for building a good bot.</p><h3 id="use-version-control" tabindex="-1"><a class="header-anchor" href="#use-version-control"><span>Use version control</span></a></h3><p>I highly recommend that you make use of version control like e.g. GitHub, BitBucket, GitLab, or similar so you don&#39;t lose your code, but also can do experiments with your bot(s) using various code branches. If you make your bot &quot;open source&quot;, other people will benefit from learning techniques from your bot, and you might also get the credit if other people decide to use parts of your code. Moreover, it will be easier to help you out, if you have an issue with your bot and need help with solving this.</p><h3 id="challenge-your-bot" tabindex="-1"><a class="header-anchor" href="#challenge-your-bot"><span>Challenge your bot</span></a></h3><p>I also recommend that you find some challenging bots to battle against, which are more advanced than the sample bots coming with Robocode, so you can adjust and improve your bot(s) even more.</p><p>Happy Robocoding! ❤️</p>`,94),s=[i];function r(l,h){return n(),t("div",null,s)}const c=e(a,[["render",r],["__file","beyond-the-basics.html.vue"]]),u=JSON.parse('{"path":"/tutorial/beyond-the-basics.html","title":"Beyond the Basics","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"The RoboWiki","slug":"the-robowiki","link":"#the-robowiki","children":[]},{"level":2,"title":"Event Queue","slug":"event-queue","link":"#event-queue","children":[]},{"level":2,"title":"Event handlers","slug":"event-handlers","link":"#event-handlers","children":[{"level":3,"title":"Keep the code at a minimum","slug":"keep-the-code-at-a-minimum","link":"#keep-the-code-at-a-minimum","children":[]},{"level":3,"title":"Avoid calling API methods!","slug":"avoid-calling-api-methods","link":"#avoid-calling-api-methods","children":[]},{"level":3,"title":"Avoid calling I/O methods!","slug":"avoid-calling-i-o-methods","link":"#avoid-calling-i-o-methods","children":[]},{"level":3,"title":"Gather intelligence information only","slug":"gather-intelligence-information-only","link":"#gather-intelligence-information-only","children":[]}]},{"level":2,"title":"Overall Bot Behavior","slug":"overall-bot-behavior","link":"#overall-bot-behavior","children":[]},{"level":2,"title":"Strategies","slug":"strategies","link":"#strategies","children":[{"level":3,"title":"Strategy types","slug":"strategy-types","link":"#strategy-types","children":[]},{"level":3,"title":"Divide and Conquer","slug":"divide-and-conquer","link":"#divide-and-conquer","children":[]},{"level":3,"title":"Multiple strategies","slug":"multiple-strategies","link":"#multiple-strategies","children":[]},{"level":3,"title":"Gun strategies","slug":"gun-strategies","link":"#gun-strategies","children":[]},{"level":3,"title":"Movement strategies","slug":"movement-strategies","link":"#movement-strategies","children":[]}]},{"level":2,"title":"Centralized logic","slug":"centralized-logic","link":"#centralized-logic","children":[{"level":3,"title":"The run method","slug":"the-run-method","link":"#the-run-method","children":[]},{"level":3,"title":"Main Loop","slug":"main-loop","link":"#main-loop","children":[]},{"level":3,"title":"Use setter methods!","slug":"use-setter-methods","link":"#use-setter-methods","children":[]}]},{"level":2,"title":"Final words","slug":"final-words","link":"#final-words","children":[{"level":3,"title":"Study the RoboWiki!","slug":"study-the-robowiki","link":"#study-the-robowiki","children":[]},{"level":3,"title":"Use version control","slug":"use-version-control","link":"#use-version-control","children":[]},{"level":3,"title":"Challenge your bot","slug":"challenge-your-bot","link":"#challenge-your-bot","children":[]}]}],"git":{"updatedTime":1721085546000},"filePathRelative":"tutorial/beyond-the-basics.md"}');export{c as comp,u as data};
