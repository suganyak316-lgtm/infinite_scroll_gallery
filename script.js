const API_KEY = "mDkm8P7VO95RNa3u-PZv-YZ31O5_yj88efCwWBAOSsA";


const gallery =
document.getElementById("gallery");


const loader =
document.getElementById("loader");


const empty =
document.getElementById("empty");


const errorBox =
document.getElementById("error");


const searchInput =
document.getElementById("searchInput");


const retry =
document.getElementById("retry");


const lightbox =
document.getElementById("lightbox");


const bigImage =
document.getElementById("bigImage");


const details =
document.getElementById("details");


const close =
document.getElementById("close");


const scroll =
document.getElementById("scroll");



let page=1;

let query="";

let loading=false;

let photos=[];

let index=0;



async function loadPhotos(reset=false){


if(loading) return;


loading=true;


loader.style.display="block";


try{


let url;


if(query){


url =
`https://api.unsplash.com/search/photos?page=${page}&per_page=12&query=${query}&client_id=${API_KEY}`;


}

else{


url =
`https://api.unsplash.com/photos?page=${page}&per_page=12&client_id=${API_KEY}`;

}



let response =
await fetch(url);



if(!response.ok)
throw Error();



let data =
await response.json();



let result =
query ? data.results : data;



if(reset){

gallery.innerHTML="";

photos=[];

page=1;

}



if(result.length===0){

empty.style.display="block";

}

else{


empty.style.display="none";


photos.push(...result);


showPhotos(result);


page++;


}



errorBox.style.display="none";



}

catch(e){


errorBox.style.display="block";


}



loader.style.display="none";


loading=false;


}




function showPhotos(items){



items.forEach(photo=>{


let div =
document.createElement("div");


div.className="card";


div.innerHTML=
`
<img src="${photo.urls.small}">
`;



div.onclick=()=>{


index =
photos.indexOf(photo);


openPhoto();

};



gallery.appendChild(div);



});


}




function openPhoto(){


let photo =
photos[index];


bigImage.src =
photo.urls.regular;



details.innerHTML=
`

<h3>${photo.user.name}</h3>

<p>Likes: ${photo.likes}</p>

<p>
Size:
${photo.width} × ${photo.height}
</p>

`;



lightbox.style.display="flex";


}




close.onclick=()=>{

lightbox.style.display="none";

};



document.addEventListener("keydown",e=>{


if(lightbox.style.display==="flex"){


if(e.key==="Escape")
close.click();



if(e.key==="ArrowRight"){

index++;

if(index>=photos.length)
index=0;


openPhoto();

}


if(e.key==="ArrowLeft"){


index--;


if(index<0)
index=photos.length-1;


openPhoto();


}


}

});





searchInput.addEventListener("input",e=>{


clearTimeout(window.timer);


window.timer=setTimeout(()=>{


query=e.target.value;


page=1;


loadPhotos(true);



},500);


});





document.querySelectorAll("aside button")
.forEach(btn=>{


btn.onclick=()=>{


query=btn.dataset.search;


searchInput.value=query;


page=1;


loadPhotos(true);



};


});





retry.onclick=()=>{

loadPhotos();

};





let observer =
new IntersectionObserver(entries=>{


if(entries[0].isIntersecting){

loadPhotos();

}


});


observer.observe(scroll);




loadPhotos();
