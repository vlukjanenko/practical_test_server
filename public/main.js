Vue.component('providers-list', {
	data: function() {
		return {
			provider: '',
			providers: []
		};
	},
	mounted() {
		fetch('http://localhost:3000/api/providers')
		.then(response => response.json())
		.then(json => this.providers = json);
	},
	methods:{
		addProvider: function() {
			this.provider = this.provider.trim();
			if(!this.provider) {
				return;
			}

			fetch('http://localhost:3000/api/providers', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				  },
				body: JSON.stringify({name: this.provider})
			})
			.then(response => {
				return (response.json());
			})
			.then(json => {
				if (json.message) {
					alert(json.message);
				} else {
					this.providers.push(json);
					this.provider = '';
				}
			})
			.catch(e => {
				console.log(e);
				alert(e);
			})
		},
		delProvider: function(id, index) {
			console.log('Come to del');
			fetch('http://localhost:3000/api/providers/' + id, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				  },
				body: JSON.stringify({name: this.provider})
			})
			.then(response => response.json())
			.then(() => this.providers.splice(index, 1));
		}
	},
	template: `
	<div class="provider">
		<div class="input-and-list">
			<input type="text" id="provider" name="provider" v-model="provider" @keyup.enter="addProvider"/>
			<div class="providers-list">
			<ul>
			<li v-for="(provider, index) in providers">
				<input type="checkbox">
				<label> {{ provider.name }} </label>
				<span class="spacer"></span>
				<img class="edit" src="edit.png"></img>
				<img @click="delProvider(provider.id, index)" class="edit" src="trash.png"></img>
			</li>
		</ul>
			</div>
		</div>
		<div id="add-provider">
			<button @click.prevent="addProvider">Add Provider</button>
		</div>
	</div>
	`
})

Vue.component('client', {
	data: function () {
	  return {

	  }
	},
	template: `
		<div class="edit-user">
			<div class="label-container">
				<label for="name">Name:</label>
				<label for="mail">E-mail:</label>
				<label for="phone">Phone:</label>
				<label for="providers">Providers:</label>
			</div>
			<div class="input-container">
				<input type="text" id="name" name="user_name" />
				<input type="email" id="mail" name="user_email" />
				<input type="phone" id="phone" name="user_phone" />
				<providers-list></providers-list>
			</div>
		</div>
	`
});

var app = new Vue({
	el: '#app',

	mounted() {
		fetch('http://localhost:3000/api/clients')
		.then(response => response.json())
		.then(json => this.table = json);
	},

	data: {
		addUser: false,
		editUser: false,
		table: []
	},
	computed: {
			getProviders() {
				return arrayIds => console.log(arrayIds[0]);
				/* return arrayIds.map(function(id){
					return this.providers.filter(p => p.id === id.id);
				}) */
			}
		},
	methods: {
		openAddUser: function(event) {
				this.editUser = false;
				this.addUser = true;
			},
		openEditUser: function(event) {
				this.editUser = true;
				this.addUser = false;
			},
		closeModal: function(event) {
				this.addUser = false;
				this.editUser = false;
			}
	}
});
