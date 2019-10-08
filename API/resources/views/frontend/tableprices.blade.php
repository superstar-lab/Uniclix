@extends('layouts.homepage')

@section('content')
<div id="banner">
	<div class="container">
		<h1>Pricing</h1>
		<p>Compare and select the plan that best suits your needs.</p>
	</div>
</div>

<div class="container mt100 mb100">
	<div class="flex-container flex-space-between pricing-table">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col" class=".empty-td"></th>
                    <th scope="col" class="plan plan-free">Free</th>
                    <th scope="col" class="plan plan-basic">Basic $10</th>
                    <th scope="col" class="plan plan-plus animated wobble">Plus $15</th>
                    <th scope="col" class="plan plan-premium">Premium $35</th>
                    <th scope="col" class="plan plan-pro">Pro $70</th>
                    <th scope="col" class="plan plan-agency">Agency $140</th>
                    <th scope="col" class="plan plan-twitter-growth">Twitter Growth $9.99</th>
                </tr>
            </thead>  
            <tbody>
                <tr>
                    <td class="feature-category"><i class="fa fa-angle-right"></i>Social Accounts</td>
                    <td>1</td>
                    <td>6</td>
                    <td>10</td>
                    <td>25</td>
                    <td>50</td>
                    <td>100</td>
                    <td>Recommended Followers</td>
                </tr>
                <tr>
                    <td class="feature-category"><i class="fa fa-angle-right"></i>Post Limitation</td>
                    <td>10 posts per account </td>
                    <td>Unlimited</td>
                    <td>Unlimited</td>
                    <td>Unlimited</td>
                    <td>Unlimited</td>
                    <td>Unlimited</td>
                    <td>Recommended Unfollowers</td>
                </tr>
                <tr>
                    <td class="feature-category"><i class="fa fa-angle-right"></i>Schedule and Publish</td>
                    <td>Limited</td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td>Target Audience</td>
                </tr>
                <tr>
                    <td class="feature-category"><i class="fa fa-angle-right"></i>Content Curation</td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td>Clear Inactive Users</td>
                </tr>
                <tr>
                    <td class="feature-category"><i class="fa fa-angle-right"></i>Mentions</td>
                    <td><i class="fa fa-close pink-cross"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td>Reply to Followers</td>
                </tr>
                <tr>
                    <td class="feature-category"><i class="fa fa-angle-right"></i>Social Listening & Monitoring</td>
                    <td><i class="fa fa-close pink-cross"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td>Mentions</td>
                </tr>
                <tr>
                    <td class="feature-category"><i class="fa fa-angle-right"></i>Analytics</td>
                    <td>Limited</td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td></td>
                </tr>
                <tr>
                    <td class="feature-category"><i class="fa fa-angle-right"></i>Advanced schedule</td>
                    <td><i class="fa fa-close pink-cross"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td><i class="fa fa-check green-check"></i></td>
                    <td></td>
                </tr>
                <tr>
                    <td class="empty-td"></td>
                    <td><a href="{{config('frontendclient.client_url')}}"><button class="plan-btn">Sign up</button></a></td>
                    <td><a href="{{config('frontendclient.client_url')}}"><button class="plan-btn">Free 30 Days Trial</button></a></td>
                    <td><a href="{{config('frontendclient.client_url')}}"><button class="plan-btn">Free 30 Days Trial</button></a></td>
                    <td><a href="{{config('frontendclient.client_url')}}"><button class="plan-btn">Free 30 Days Trial</button></a></td>
                    <td><a href="{{config('frontendclient.client_url')}}"><button class="plan-btn">Buy Now</button></a></td>
                    <td><a href="{{config('frontendclient.client_url')}}"><button class="plan-btn">Buy Now</button></a></td>
                    <td><a href="{{config('frontendclient.client_url')}}"><button class="plan-btn">Free 30 Days Trial</button></a></td>
                </tr>
            </tbody>
        </table>
	</div>
</div>

<div class="container">
	<div class="bg-white-radius panel-bg">
		<div class="col-md-6 col-xs-12">
			<h4>ENTERPRISE</h4>
			<p>Custom Solution - Contact for Pricing</p>
		</div>
		<div class="col-md-6 col-xs-12 text-right lh4">
			<a href="#" class="btn-white-bg">Contact</a>
		</div>
	</div>
</div>

<script>

    $(".pricing-table th").on("mouseover", function(){
        $(this).addClass("animated flipInX");
    });

    $(".pricing-table th").on("mouseout", function(){
        $(this).removeClass("animated flipInX");
        $(this).removeClass("animated wobble");
    });

    $(".pricing-table td button").on("mouseover", function(){
        $(this).addClass("animated rubberBand");
    });

    $(".pricing-table td button").on("mouseout", function(){
        $(this).removeClass("animated rubberBand");
    });
</script>

@include('frontend.includes.footer')

@endsection