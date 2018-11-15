/**
 * Created by Administrator on 2017/9/18 0018.
 */
class Index{
  constructor(){}

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  index(req, res, next){

    res.render('index')
  }
}

module.exports = Index;