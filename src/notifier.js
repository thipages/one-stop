export default function (notifyFn, timeout) {
    return timeout === 0
        ? notifyFn
        : postpone(notifyFn, timeout)
}
function postpone(fn, timeout) {
    let timer
    return () => {
        if (timer) return
        timer = setTimeout (
        () => {
            clearTimeout(timer)
            fn()
        }, timeout
        )
    }
}