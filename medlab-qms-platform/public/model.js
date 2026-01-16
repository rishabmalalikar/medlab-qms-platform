// Inject modal HTML into every page
document.body.insertAdjacentHTML("beforeend", `
<div id="customModal" style="
    display:none;
    position:fixed;
    top:0; left:0;
    width:100%; height:100%;
    background:rgba(0,0,0,0.5);
    justify-content:center;
    align-items:center;
    z-index:1000;
">
  <div style="background:white; padding:20px; border-radius:8px; width:350px; text-align:center; font-size:14px;">
    <p id="modalMessage">Message here...</p>
    <div style="margin-top:15px;">
      <button id="okBtn" style="background:green; color:white; padding:5px 15px; margin:5px; border:none; border-radius:4px;">OK</button>
      <button id="cancelBtn" style="background:gray; color:white; padding:5px 15px; margin:5px; border:none; border-radius:4px;">Cancel</button>
    </div>
  </div>
</div>
`);

function showModal(message, isConfirm = false) {
  return new Promise(resolve => {
    const modal = document.getElementById("customModal");
    const msg = document.getElementById("modalMessage");
    const okBtn = document.getElementById("okBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    msg.innerText = message;
    modal.style.display = "flex";
    cancelBtn.style.display = isConfirm ? "inline-block" : "none";

    okBtn.onclick = () => { modal.style.display = "none"; resolve(true); };
    cancelBtn.onclick = () => { modal.style.display = "none"; resolve(false); };
  });
}

// Override alert/confirm
window.alert = function(message) {
  return showModal(message, false);
};
window.confirm = function(message) {
  return showModal(message, true);
};
