import Vue from 'vue';
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

import {
  Container,
  Header,
  Main,
  Button,
  Select,
  Card,
  Input,
  Row,
  Col,
  Option,
  Checkbox,
  Divider,
  Footer,
  Badge,
  Tree,
  Tooltip,
  InputNumber
} from 'element-ui';

locale.use(lang);

Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Button);
Vue.use(Select);
Vue.use(Card);
Vue.use(Input);
Vue.use(Row);
Vue.use(Col);
Vue.use(Option);
Vue.use(Checkbox);
Vue.use(Divider);
Vue.use(Footer);
Vue.use(Badge);
Vue.use(Tree);
Vue.use(Tooltip);
Vue.use(InputNumber);
