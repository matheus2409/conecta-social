function buscarLocaisProximos(esporte) {
	if (esporte === 'futebol') {
		window.open('https://www.google.com/maps/search/futebol+são+joose+do+rio+preto/@-20.7947097,-49.3716367,13.04z/data=!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MTAwNi4wIKXMDSoASAFQAw%3D%3D', '_blank');
		return;
	}
	if (esporte === 'futsal') {
		window.open('https://www.google.com/maps/search/futesal+s%C3%A3o+joose+do+rio+preto/@-20.7945394,-49.3716368,13z/data=!3m1!4b1!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D', '_blank');
		return;
	}
	if (esporte === 'futevolei') {
		window.open('https://www.google.com/maps/search/futevolei+s%C3%A3o+joose+do+rio+preto/@-20.7941987,-49.371637,13z/data=!3m1!4b1!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D', '_blank');
		return;
	}
	if (esporte === 'handebol') {
		window.open('https://www.google.com/maps/search/handebol+s%C3%A3o+joose+do+rio+preto/@-20.7937139,-49.4952541,11z/data=!3m1!4b1!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D', '_blank');
		return;
	}
	if (esporte === 'volei_de_areia') {
		window.open('https://www.google.com/maps/search/volei+de+areia+s%C3%A3o+joose+do+rio+preto/@-20.7937139,-49.4952541,11z/data=!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D', '_blank');
		return;
	}
	if (esporte === 'volei') {
		window.open('https://www.google.com/maps/search/volei+são+joose+do+rio+preto/@-20.7946999,-49.3718084,13z/data=!3m1!4b1!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MTAwNi4wIKXMDSoASAFQAw%3D%3D', '_blank');
		return;
	}
	if (esporte === 'basquete') {
		window.open('https://www.google.com/maps/search/Basquete+são+jose+do+rio+preto/@-20.793051,-49.3976703,13z/data=!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MTAwNi4wIKXMDSoASAFQAw%3D%3D', '_blank');
		return;
	}
	if (esporte === 'rugby') {
		window.open('https://www.google.com/maps/search/rugby+são+jose+do+rio+preto/@-20.8159734,-49.385687,14z/data=!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MTAwNi4wIKXMDSoASAFQAw%3D%3D', '_blank');
		return;
	}
	if (esporte === 'tenis_de_mesa') {
		window.open('https://www.google.com/maps/place/NEW+PONG+-+Academia+de+T%C3%AAnis+de+Mesa/@-20.8611262,-49.3065275,11.88z/data=!4m6!3m5!1s0x94bdad45481f4781:0x98ac37500298741!8m2!3d-20.8381911!4d-49.3697763!16s%2Fg%2F11t7fqv2tb!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MTAxMi4wIKXMDSoASAFQAw%3D%3D', '_blank');
		return;
	}
	if (!navigator.geolocation) {
		alert('Geolocalização não suportada pelo navegador.');
		return;
	}
	navigator.geolocation.getCurrentPosition(function(pos) {
		const lat = pos.coords.latitude;
		const lon = pos.coords.longitude;
		let tipo = '';
		if (esporte === 'basquete') {
			tipo = 'quadra de basquete';
		}
		const url = `https://www.google.com/maps/search/${encodeURIComponent(tipo)}+perto+de+${lat},${lon}`;
		window.open(url, '_blank');
	}, function() {
		alert('Não foi possível obter sua localização.');
	});
}