@extends('layouts.homepage')

@section('content')
<div id="banner">
	<div class="container">
		<h1>Blog</h1>
		<p>Manuals take time. These videos will get you started instantly.</p>
	</div>
</div>

<div class="container article-page-content">
	<div class="row mt100 mb100">
		<div class="col-md-8 col-xs-12">
			<div class="article-image">
				<div class="article-image-social">
					<div class="pb10"><a href="http://www.facebook.com/sharer.php?u={{route('article', $post->id)}}" target="_blank"><i class="fa fa-facebook"></i></div></a>
					<div class="pb10"><a class="twitter-share-button" href="https://twitter.com/intent/tweet?text={{route('article', $post->id)}}" target="_blank"><i class="fa fa-twitter"></i></a></div>
					<div class="pb10"><i class="fa fa-instagram"></i></div>
				</div>
				<div class="article-image-image">
					<img src="/post_images/{{$post->image}}" class="img-responsive">					
				</div>				
			</div>
			<div class="article-content mt50">
				<h4 class="text-uppercase fw700">{{$post->title}}</h4>
				<div class="posted-by">By {{$post->admin->name}} on {{$post->created_at->format('F d, Y')}}</div>
				{!! $post->content !!}
				<!-- <h4 class="mt50 text-uppercase fw700">Recent Comments</h4>
				<div class="article-comments pt30">
					<div class="article-comment">
						<div class="article-comment-photo text-center">
							<div class="comment-img">
								<img src="{{ asset('/images/comment-img.png')}}">
							</div>
						</div>
						<div class="article-comment-text">
							<h5>Jeffrey Caleman</h5>
							<div class="comment-date">05. 05. 2019 at 7:00 PM</div>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
						</div>
					</div>
					<div class="article-comment">
						<div class="article-comment-photo text-center">
							<div class="comment-img">
								<img src="{{ asset('/images/comment-img.png')}}">
							</div>
						</div>
						<div class="article-comment-text">
							<h5>Jeffrey Caleman</h5>
							<div class="comment-date">05. 05. 2019 at 7:00 PM</div>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
						</div>
					</div>
				</div>
				<h4 class="mt50 text-uppercase fw700">Leave a Comment</h4>
				<div>
					<form class="comment-form">
						<div class="row pb20 pt20">
							<div class="col-md-6 col-xs-12">
								<input type="text" name="name" class="form-input" placeholder="Name">
							</div>
							<div class="col-md-6 col-xs-12">
								<input type="email" name="email" class="form-input" placeholder="E-mail">
							</div>
						</div>
						<div class="row pb20">
							<div class="col-xs-12">
								<textarea class="form-input" placeholder="Comment..."></textarea>
							</div>
						</div>
						<div class="row mb20">
							<div class="col-xs-12 text-right">
								<a href="#" class="btn theme-btn">Post</a>
							</div>
						</div>
					</form>
				</div> -->
			</div>
		</div>
		<div class="col-md-4 col-xs-12 category-tags-posts">
			<input type="text" name="name" class="form-input search-input" placeholder="Name">
			<h4 class="mt50 text-uppercase fw700">Categories</h4>
			<ul class="article-categories">
				@foreach($categories as $category)
					@if($category->id == $post->category_id)
						<li class="active">{{$category->category_name}}</li>
					@else
						<li>{{$category->category_name}}</li>
					@endif
				@endforeach
			</ul>
			<h4 class="mt50 text-uppercase fw700">Tags</h4>
			@foreach($post->tags as $tag)
				<span class="tag">{{$tag->tag_name}}</span>
			@endforeach
			<h4 class="mt50 text-uppercase fw700">Recent Posts</h4>
			<div class="recent-posts pt30">
				@foreach($recent_posts as $rpost)
				<div class="recent-post">
					<!-- <div class="recent-posts-photo text-center">
						<div class="comment-img">
							<img src="{{ asset('/images/comment-img.png')}}">
						</div>
					</div> -->
					<div class="recent-posts-text">
						<a href="{{ route('article', $post->id) }}"><h5>{{$rpost->title}}</h5></a>
						<div class="comment-date">Posted by {{$rpost->admin->name}}</div>
						<div class="comment-date">{{$rpost->created_at->format('F d, Y')}}</div>
					</div>
				</div>
				@endforeach
			</div>
		</div>
	</div>
</div>

@include('frontend.includes.footer')

@endsection