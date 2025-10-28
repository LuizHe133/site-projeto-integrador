<form id="login-form">
  <input type="email" id="email" placeholder="E-mail">
  <input type="password" id="senha" placeholder="Senha">
  <button id="btn-login">Entrar</button>
  <p id="msg"></p>
</form>

<script>
document.getElementById("btn-login").addEventListener("click", function(e) {
  e.preventDefault()

  const email = document.getElementById("email").value.trim()
  const senha = document.getElementById("senha").value.trim()
  const msg = document.getElementById("msg")

  const user = JSON.parse(localStorage.getItem("usuario"))

  if (!email || !senha) {
    msg.textContent = "Preencha todos os campos"
    msg.style.color = "red"
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    msg.textContent = "Digite um e-mail válido"
    msg.style.color = "red"
    return
  }

  if (!user || user.email !== email || user.senha !== senha) {
    msg.textContent = "Usuário ou senha inválidos"
    msg.style.color = "red"
    return
  }

  localStorage.setItem("logado", "true")
  window.location.href = "index.html"
})
</script>
