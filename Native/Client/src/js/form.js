window.onload = function () {
  const form = document.querySelector('#form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form)
    const key = formData.get('key')
    if (!key || key === '') {
      showToast("Please enter a key!", "error")
    } else {
      checkConnection()
      addOverlay('form')
      try {
        const deadline = await contract.deadline()
        if (deadline === 0n) {
          showToast(
            "The swap is complete, there's nothing to comfirm",
            'error'
          )
          return
        }

        const tx = await contract.confirmSwap(key)
        await tx.wait()
        showToast('Success Confirm Swap!', 'success')
        form.reset()
      } catch (err) {
        console.log(err)

        const reason = extractErrorReason(err)
        console.log(reason)
        if (!reason)
          showToast('Error confirm swap! ' + reason + '.', 'error')
        else showToast('Error confirm swap!', 'error')
      } finally {
        removeOverlay('form')
        setTimeout(() => {
          setFormInfo()
        }, 1500)
      }
    }
  })
}