console.log("ESTAS EN CALCULADORA.JS")

function capturar(arg){
    console.log(arg)
    var valor = arg.dataset.valor;
    var caja_texto_resultado = document.getElementById("txt_caja_resultado")
    caja_texto_resultado.value +=valor;
}