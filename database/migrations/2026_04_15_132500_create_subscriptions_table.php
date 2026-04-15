<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            // Relationship with Users
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            // Relationship with Categories (Fixed the missing table issue)
            $table->foreignId('category_id')
                  ->nullable()
                  ->constrained('categories')
                  ->nullOnDelete();

            $table->string('name');                    
            $table->string('description')->nullable(); 
            $table->decimal('price', 10, 2);           
            $table->string('currency')->default('INR'); 
            $table->string('billing_cycle');           // monthly, yearly, weekly
            $table->date('renewal_date');              
            $table->date('start_date');                
            $table->string('status')->default('active'); 
            $table->string('website')->nullable();      
            $table->string('logo')->nullable();         
            $table->string('color')->nullable();        
            $table->text('notes')->nullable();          
            $table->boolean('reminder')->default(true); 
            $table->integer('reminder_days')->default(3); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};