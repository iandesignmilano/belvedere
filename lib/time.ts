// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// arrontonda l'orario
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function roundToNext15Minutes(date: Date): Date {
    const minutes = date.getMinutes()
    const remainder = minutes % 15
    const add = remainder === 0 ? 0 : 15 - remainder

    const rounded = new Date(date)
    rounded.setMinutes(minutes + add)
    rounded.setSeconds(0)
    rounded.setMilliseconds(0)

    if (rounded.getMinutes() === 60) {
        rounded.setMinutes(0)
        rounded.setHours(rounded.getHours() + 1)
    }

    return rounded
}