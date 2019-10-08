@extends('layouts.homepage')

@section('content')
<div id="banner">
    <div class="container">
        <h1>Join the Uniclix journey</h1>
        <p>Working at Uniclix is more than just a job.</p>
        <p>Want to come along for the ride?</p>
    </div>
</div>

<div class="container mb100 jobs-container" style="margin-top:30px">
    

<h2>What is Uniclix?</h2>
<p>We're a small team working to help people build their businesses on social media. Uniclix provides tools to help individuals, businesses and publishers build an audience online and engage with followers as effectively as possible.</p>

<h2>Where will I work?</h2>
<p>Uniclix is spread across the globe. We have UniClixer in 3 countries, and spreading. As a member of our team, you will be invited to work wherever you're happiest and most productive.</p>

<h2>What is the Uniclix team like?</h2>
<p>Uniclix is an equal opportunity employer that has the awesome opportunity to add teammates from anywhere in the world! We're united by UniClix values, and we celebrate our unique differences.</p>

<h2>What kind of people work at Uniclix? </h2>
<p>We're excited about diversity and inclusion—we hire talented teammates from a wide variety of backgrounds and experiences, and we're committed to a work environment of respect and kindness.</p>

<h2>Who we’re looking for? </h2>
<p>We’re building a team to bring vision to life around these core values: </p>
<ul>
<li><strong>Loyalty:</strong> We are in this for the long haul, and we are looking for talents who share our ambition of creating a sustainable company.</li> 
<li><strong>Accountability: </strong>There is nothing we admire more than people who own their projects, take responsibility for their mistakes and appear consistently reliable. </li>
<li><strong>Passion: </strong>If you are the kind of person who shows up and “ships” work day in, day out, then you are who we are looking for </li>
<li><strong>Curiosity: </strong>Poking around and learning new things is part of our daily lives here at Uniclix. </li>
<li><strong>Respect: </strong>Maintaining a pleasant work atmosphere for the entire team is our priority, warning; this is ego-free area. </li>
</ul>
 
 
<h2>Perks and Benefits</h2>
 <p>In addition to our unique culture, we also offer these fun perks and benefits:</p>

<ul> 
<li><strong>Work remotely:</strong> Live and work wherever you like! (selected countries only) </li>
<li><strong>Profit sharing: </strong>When the company does well, all team members share the profits!</li>
<li><strong>Shares: </strong>As an early member of the team you will be awarded company shares </li>
</ul>

<h2>Job Opening</h2>

<ul>
    <li><a href="/software-developer">Software Developer</a></li>
</ul>

</div>

<style>
    .jobs-container p, .jobs-container li{
        font-size:20px;
    }
</style>

@include('frontend.includes.footer')


@endsection