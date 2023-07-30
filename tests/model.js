export default  {
    count:0,
    array : [1, 2, 3],
    nest : {
      count:0
    },
    isZeroCount() {
        return this.count === 0
    },
    getCount() {
      return this.count
    },
    actions : {
      increment (inc) {
        this.count += inc
      }
    }
  }