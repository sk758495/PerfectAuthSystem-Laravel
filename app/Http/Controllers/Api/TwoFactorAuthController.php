<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class TwoFactorAuthController extends Controller
{
    public function enable(Request $request)
    {
        $user = $request->user();
        $google2fa = new Google2FA();

        if (!$user->two_factor_secret) {
            $user->two_factor_secret = $google2fa->generateSecretKey();
            $user->save();
        }

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $user->two_factor_secret
        );

        $renderer = new ImageRenderer(
            new RendererStyle(256),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $qrCodeSvg = $writer->writeString($qrCodeUrl);

        return response()->json([
            'secret' => $user->two_factor_secret,
            'qr_code_svg' => $qrCodeSvg,
        ]);
    }

    public function confirm(Request $request)
    {
        $request->validate(['code' => 'required|string']);
        
        $user = $request->user();
        $google2fa = new Google2FA();
        
        $valid = $google2fa->verifyKey($user->two_factor_secret, $request->code);

        if ($valid) {
            $user->two_factor_confirmed_at = now();
            $user->save();
            return response()->json(['message' => 'Two-factor authentication successfully confirmed.']);
        }

        return response()->json(['message' => 'Invalid two-factor authentication code.'], 400);
    }

    public function disable(Request $request)
    {
        $user = $request->user();
        $user->two_factor_secret = null;
        $user->two_factor_confirmed_at = null;
        $user->save();

        return response()->json(['message' => 'Two-factor authentication disabled.']);
    }
}
