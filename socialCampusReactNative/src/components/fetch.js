export function get(url){

  return fetch(url)
    .then((response) => response.json())
    .then((response) =>{
        return response;
    });

}

export function url(){
  var url = "http://192.168.1.104:8080/"
  return url;
}

export async function post(url, formData){
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers:{
      'Content-Type': 'application/json',
    },
  }).then(response => response.json() )
    .then((response) => {
        return response;
  })
}
