<script>
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/Firebase';
	import { Form, FormGroup, Input, Label, Button, Spinner, Alert } from 'sveltestrap';
	import { onMount } from 'svelte';
	import { ROUTES } from '$lib/routelist';
	import { signout } from '$lib/auth.js';
</script>

<h4>Student Home</h4>
