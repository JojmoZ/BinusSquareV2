<script lang="ts">
	import Header from './../Header.svelte';
	export let data: { username: string };
</script>

<div class="real-home">
    <div class="home">
        <h1 class="welcome">Hello, {data.username}!</h1>
        <p class="tagline">Welcome to our take on <strong>New Binus Square</strong>!</p>
    
        <div class="members">
            <span class="member" style="top: 10%; left: 15%;">VINCENTIUS JONATHAN TANUJAYA</span>
            <span class="member" style="top: 25%; right: 20%;">BRAVEN JOSEPH WIDJAJA</span>
            <span class="member" style="top: 50%; left: 10%;">GERVASIUS RUSSELL</span>
            <span class="member" style="bottom: 20%; right: 25%;">AQUILA KYNE SUDIRO</span>
            <span class="member" style="bottom: 10%; left: 20%;">GEOFFREY ANTONIO ARIFIN</span>
        </div>
    </div>
</div>



<style>
    .real-home {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}
.home {
	position: relative;
	flex: 1;
	padding: 4rem 2rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: linear-gradient(to bottom right, #e0f7fa, #c8e6c9);
	color: #2e2e2e;
	font-family: 'Segoe UI', sans-serif;
	overflow: hidden;
	text-align: center;
}

.welcome {
	font-size: 2.5rem;
	margin-bottom: 1rem;
}

.tagline {
	font-size: 1.25rem;
	color: #555;
	margin-bottom: 3rem;
}

.members {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
}

.member {
	position: absolute;
	font-weight: bold;
	font-size: 0.95rem;
	color: #2e7d32;
	background: rgba(255, 255, 255, 0.75);
	padding: 0.5rem 1rem;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	animation: float 6s ease-in-out infinite;
	transform: rotate(-3deg);
	white-space: nowrap;
}

@keyframes float {
	0% { transform: translateY(0px) rotate(-3deg); }
	50% { transform: translateY(-10px) rotate(3deg); }
	100% { transform: translateY(0px) rotate(-3deg); }
}
</style>
