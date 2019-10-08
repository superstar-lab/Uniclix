@extends('layouts.homepage')

@section('content')
<div id="banner">
	<div class="container">
		<h1>Get access to our Premium feature</h1>
		<a href="">UPGRADE</a>
	</div>
</div>

<div class="bg-image-content">
	<div class="container">
		<div class="row p100">
			<div class="col-md-6 col-xs-12 pt150">
				<h2>Customize your best Time anytime</h2>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin mauris ante, vulputate et justo in, condimentum ornare metus.</p>
			</div>
			<div class="col-md-6 col-xs-12">
				<img class="img-responsive maxw400" src="{{asset('/images/calendar-img.png')}}">
			</div>
		</div>
		<div class="row p100">
			<div class="col-md-6 col-xs-12">
				<img class="img-responsive" src="{{asset('/images/laptop-img.png')}}">
			</div>
			<div class="col-md-6 col-xs-12 pt130">
				<h2>Get Social analytics for your accounts</h2>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin mauris ante, vulputate et justo in, condimentum ornare metus.</p>
			</div>
		</div>
	</div>
</div>

<div class="bg-grey-content">
	<div class="container">
		<div class="row">
			<div class="bg-white-radius">
				<div class="col-md-6 col-xs-12">
					<h2>Ready to get started?</h2>
					<p>Let's start by creating a new account.</p>
				</div>
				<div class="col-md-6 col-xs-12 text-right lh7">
					<a href="#" class="compose-btn btn-start">Create new account</a>
				</div>
			</div>
		</div>
		@include('frontend.includes.footer')
	</div>
</div>
@endsection