const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs');

let database = []
for (var j = 1; j < 2483; j += 50) {
	doTimeOut(j)
}

function doTimeOut(j) {
	setTimeout(function() {
	  let url = `https://www.imdb.com/search/title/?country_of_origin=bd&start=${j}&ref_=adv_nxt`;
	  (async()=> {
		await axios.get(url, {
			header: {
				'accept-encoding': 'gzip',
				'referer': 'https://www.imdb.com/',
				'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36'
			}
		}).then(async(res) => {
			const data = res.data
			const $ = cheerio.load(data)
			const titles = $('h3[class="lister-item-header"]')

			for (var i = 0; i < titles.length; i++) {
				let item = titles.eq(i)
				let content = $('div[class="lister-item-content"]').eq(i)
				let link = item.find('a').attr('href')
				let _url = `https://www.imdb.com${link.replace('/?', '/fullcredits/?')}`
				await getDirector(_url,i)

		async function getDirector(url, index) {
			await axios.get(url).then((res) =>{
						const data = res.data
						const $ = cheerio.load(data)
						let title = item.find('a').text().trim()
						let year = item.find('.lister-item-year').text().trim().replace(/[a-zA-Z()]/g, '').split('–')[0]
						let director = $('div[id="fullcredits_content"]').find('table >tbody>tr td>a').eq(0).text().trim()
						database.push({title, year, director})
						console.log({title, year, director})
							   }) //axios.get
							   .catch(err => console.log(err))
				    	} //getDirector
		      } //for loopdoTimeOut


			fs.appendFile(`imdb-documentary.json`, JSON.stringify(database),'utf8', function (err) {
		  		if (err) throw err;
		  		console.log(`Saved!${j}`);
			}) //fs.appendFile
		}) //axios.get
	})()
  }, 2000)
}

// $('h3[class="lister-item-header"]>a').text()
// document.getElementsByClassName('lister-item-header')[1].children[1].innerText
