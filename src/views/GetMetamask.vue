<template>
  <div class="container">
    <div class="signin-content">
      <div class="signin-image">
        <figure>
          <img src="../assets/images/metamask.png" alt="sing up image" />
        </figure>
      </div>
      <div class="signin-form">
        <h2 class="form-title">MetaMask Setup</h2>
        <div>
          1) Download and install Metamask extension ->
          <a href="https://metamask.io/download.html" target="_blank">link</a>
          <br />
          2) Follow Metamask first setup (create a wallet and a password)
          <br />
          3) Click on the top right where you find "Main Ethereum Network", and
          change it to "Ropsten Test Network"
          <br />
          4) Click where you read "Address 1" and an address like "0x2d...9S" to
          copyt the address to the clipboard
          <br />
          5) Go to
          <a href="https://faucet.ropsten.be/" target="_blank"
            >faucet.ropsten.be</a
          >
          and paste the address, then click on "Send me test Ether"
          <br />
          6) Wait for some seconds until you find 1 ether in your Metamask
          interface
          <br />
          7) Now you can operate with smart contracts on Ropsten, go back to the
          app
          <br />
          <br />
          0) When it asks you to "Connect With MetaMask" click "Next", then
          "Connect"
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>