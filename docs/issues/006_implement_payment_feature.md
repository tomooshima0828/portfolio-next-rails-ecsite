
# Issue 006: Implement Payment Feature with Stripe
# Issue 006: Stripeによる決済機能の実装

## 1. Overview
## 1. 概要

This issue covers the implementation of the payment feature using Stripe. The goal is to integrate Stripe into the checkout process, allowing users to make payments using test credit card numbers. For this portfolio project, a full production setup is not required. The implementation should focus on creating a seamless and secure test payment flow from the shopping cart to the order confirmation.

本Issueは、Stripeを使用した決済機能の実装を対象とします。目標は、チェックアウトプロセスにStripeを統合し、ユーザーがテスト用のクレジットカード番号で決済できるようにすることです。このポートフォリオプロジェクトでは、本番環境の完全なセットアップは不要です。実装は、ショッピングカートから注文確定までのシームレスで安全なテスト決済フローの構築に重点を置きます。

> **Note on Stripe Account / Stripeアカウントに関する注記**
> A production Stripe account is **not** necessary for this implementation. We will use Stripe's **test mode**, which provides test API keys and a range of test card numbers. This allows for full development and testing of the payment flow without any real financial transactions.
>
> 本実装において、本番用のStripeアカウントは**不要**です。Stripeが提供する**テストモード**を使用し、テスト用のAPIキーとテストカード番号を利用します。これにより、実際の金融取引を一切行わずに、決済フロー全体の開発とテストが可能です。

## 2. Related Requirements
## 2. 関連要件

- **U-010: Order Process / 注文プロセス**
  - Users proceed from the shopping cart to a payment page/modal.
  - ユーザーはショッピングカートから決済ページ/モーダルに進む。
- **U-011: Order Completion / 注文完了**
  - After a successful payment, the user is shown an order confirmation.
  - 決済成功後、ユーザーに注文完了が表示される。
- **Dependencies:** This feature depends on a functional shopping cart (Issue 005).
- **依存関係:** この機能は、正常に動作するショッピングカート（Issue 005）に依存します。

## 3. Tasks
## 3. タスク

### 3.1. Backend (Ruby on Rails)
### 3.1. バックエンド (Ruby on Rails)

- **T-001: Add `stripe` Gem**
  - Add the `stripe` gem to the `Gemfile` and run `bundle install`.
  - `Gemfile`に`stripe` gemを追加し、`bundle install`を実行する。
- **T-002: Configure Stripe API Keys**
  - Set up Stripe test API keys (secret key) in Rails credentials or environment variables.
  - StripeのテストAPIキー（シークレットキー）をRailsのcredentialsまたは環境変数に設定する。
- **T-003: Create Payment Intent API Endpoint**
  - Implement an endpoint (e.g., `POST /api/v1/payment_intents`) that creates a Stripe `PaymentIntent`.
  - Stripeの`PaymentIntent`を作成するエンドポイント（例: `POST /api/v1/payment_intents`）を実装する。
  - This endpoint will take the cart total amount and return a `client_secret` to the frontend.
  - このエンドポイントはカートの合計金額を受け取り、`client_secret`をフロントエンドに返す。
- **T-004: Create Order Model and Migrations**
  - Define an `Order` model to store order details (user_id, total_amount, status, stripe_payment_intent_id, etc.).
  - `Order`モデルを定義し、注文詳細（user_id, total_amount, status, stripe_payment_intent_idなど）を保存する。
- **T-005: Implement Webhook for Payment Confirmation (Optional but Recommended)**
  - Create a webhook endpoint to listen for Stripe events (e.g., `payment_intent.succeeded`).
  - Stripeイベント（例: `payment_intent.succeeded`）をリッスンするためのWebhookエンドポイントを作成する。
  - This ensures reliable order status updates even if the user closes the browser post-payment.
  - これにより、ユーザーが決済後にブラウザを閉じても、注文ステータスが確実に更新される。
- **T-006: Write RSpec Tests**
  - Test the Payment Intent creation and webhook logic.
  - Payment Intentの作成とWebhookのロジックをテストする。

### 3.2. Frontend (Next.js)
### 3.2. フロントエンド (Next.js)

- **T-007: Add Stripe React Libraries**
  - Install `@stripe/react-stripe-js` and `@stripe/stripe-js`.
  - `@stripe/react-stripe-js`と`@stripe/stripe-js`をインストールする。
- **T-008: Create Stripe `Elements` Provider**
  - Wrap the checkout page/component with the `Elements` provider to enable Stripe components.
  - チェックアウトページ/コンポーネントを`Elements`プロバイダでラップし、Stripeコンポーネントを有効化する。
- **T-009: Implement Checkout Form**
  - Create a checkout form component using `CardElement` or other Stripe Elements for secure input of card details.
  - `CardElement`などのStripe Elementsを使用して、安全なカード情報入力のためのチェックアウトフォームコンポーネントを作成する。
- **T-010: Implement Payment Flow**
  - When the user proceeds to pay:
    1.  Fetch the `client_secret` from the Rails backend.
    2.  Call `stripe.confirmCardPayment` with the `client_secret` and card details.
    3.  Handle the payment result (success or error).
- **T-010: 決済フローの実装**
  - ユーザーが決済に進んだ際：
    1.  Railsバックエンドから`client_secret`を取得する。
    2.  `client_secret`とカード情報を使って`stripe.confirmCardPayment`を呼び出す。
    3.  決済結果（成功またはエラー）を処理する。
- **T-011: Create Order Confirmation Page**
  - On successful payment, redirect the user to an order confirmation page.
  - 決済が成功したら、ユーザーを注文完了ページにリダイレクトする。
- **T-012: Write Tests for Components**
  - Use Jest and React Testing Library to test the checkout form and payment flow.
  - JestとReact Testing Libraryを使用して、チェックアウトフォームと決済フローをテストする。

## 4. Acceptance Criteria
## 4. 受け入れ基準

- **AC-001:** From the cart, a user can proceed to a payment interface.
- **AC-001:** ユーザーはカートから決済インターフェースに進むことができること。
- **AC-002:** The payment interface provides a secure field for entering Stripe's test card numbers.
- **AC-002:** 決済インターフェースには、Stripeのテストカード番号を安全に入力するためのフィールドが提供されること。
- **AC-003:** Submitting the payment with a valid test card number results in a successful transaction.
- **AC-003:** 有効なテストカード番号で決済を送信すると、トランザクションが成功すること。
- **AC-004:** After a successful payment, an order record is created in the backend database.
- **AC-004:** 決済成功後、バックエンドのデータベースに注文レコードが作成されること。
- **AC-005:** The user is redirected to a confirmation page displaying a success message.
- **AC-005:** ユーザーは成功メッセージが表示された確認ページにリダイレクトされること。
- **AC-006:** Submitting an invalid test card number or a card that should be declined results in an appropriate error message shown to the user.
- **AC-006:** 無効なテストカード番号や拒否されるべきカードで送信した場合、適切なエラーメッセージがユーザーに表示されること。

## 5. Implementation Details & Key Points
## 5. 実装詳細と重要ポイント

### 5.1. Payment Flow Architecture
### 5.1. 決済フローのアーキテクチャ

The implementation will use **Stripe Payment Intents**, which is the recommended modern approach.

実装には、推奨されるモダンなアプローチである**Stripe Payment Intents**を使用します。

1.  **User clicks "Pay"**: Frontend requests a `PaymentIntent` from the Rails backend, sending the cart amount.
2.  **Backend creates PaymentIntent**: Rails API creates a `PaymentIntent` with the specified amount and currency, and returns its `client_secret` to the frontend.
3.  **Frontend confirms payment**: The Next.js app uses the `client_secret` and the user's card details (collected via `CardElement`) to call `stripe.confirmCardPayment`. The card details are sent directly to Stripe, not our server.
4.  **Handle result**: The frontend displays a success or error message based on the outcome. The backend can use webhooks to reliably update the order status.

1.  **ユーザーが「支払う」をクリック**: フロントエンドがカート金額を送信し、Railsバックエンドに`PaymentIntent`をリクエストします。
2.  **バックエンドがPaymentIntentを作成**: Rails APIが指定された金額と通貨で`PaymentIntent`を作成し、その`client_secret`をフロントエンドに返します。
3.  **フロントエンドが支払いを確定**: Next.jsアプリが`client_secret`とユーザーのカード情報（`CardElement`経由で収集）を使用して`stripe.confirmCardPayment`を呼び出します。カード情報は私たちのサーバーではなく、Stripeに直接送信されます。
4.  **結果の処理**: フロントエンドは結果に基づいて成功またはエラーメッセージを表示します。バックエンドはWebhookを使用して注文ステータスを確実に更新できます。

### 5.2. Key Code Snippets
### 5.2. 主要なコードスニペット

**Backend: Creating PaymentIntent (Rails)**
```ruby
# app/controllers/api/v1/payment_intents_controller.rb
class Api::V1::PaymentIntentsController < ApplicationController
  before_action :authenticate_user!

  def create
    # In a real app, calculate amount from the user's cart
    amount = calculate_order_amount(current_user.cart_items)

    payment_intent = Stripe::PaymentIntent.create(
      amount: amount,
      currency: 'jpy',
      automatic_payment_methods: {
        enabled: true,
      },
    )

    render json: { clientSecret: payment_intent.client_secret }
  end

  private

  def calculate_order_amount(items)
    # Replace with your actual logic
    items.sum(&:subtotal)
  end
end
```

**Frontend: Checkout Form (Next.js/React)**
```typescript
// components/CheckoutForm.tsx
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/confirmation`,
      },
    });

    if (error) {
      console.error(error.message);
      // Show error to your customer
    } else {
      // Payment succeeded
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>Pay</button>
    </form>
  );
}
```

## 6. Notes
## 6. 備考

- This implementation will focus solely on the test environment. Production-specific considerations like robust error logging, fraud detection, and handling multiple currencies are out of scope for this portfolio piece.
- この実装はテスト環境のみに焦点を当てます。堅牢なエラーロギング、不正検知、多通貨対応といった本番環境特有の考慮事項は、このポートフォリオの範囲外とします。
- We will use Stripe's predefined [test card numbers](https://stripe.com/docs/testing#cards) for all testing.
- すべてのテストには、Stripeが定義した[テストカード番号](https://stripe.com/docs/testing#cards)を使用します。
