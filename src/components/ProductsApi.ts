import { IApiProductsResponse, IProduct } from "../types";
import { Api } from "./base/api";

interface IWebLarekAPI {
	getProductList(): Promise<IProduct[]>;
	// postOrder(order: TSendProduct): Promise<TAnswerOrder>;
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product/')
        .then((data: IApiProductsResponse) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image.replace('.svg', '.png'),
			}))
		);
	}
	// postOrder(order: TSendProduct): Promise<TAnswerOrder> {
	// 	return this.post('/order/', order).then((data: TResponseOrder) => {
	// 		if ('id' in data && 'total' in data) {
	// 			return data;
	// 		} else {
	// 			throw new Error(data.error);
	// 		}
	// 	});
	// }
}